#!/usr/bin/env python3
"""Build a read-only Gmail/Calendar triage report from saved MCP JSON results."""
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

URL_RE = re.compile(r'https?://[^\s)<>\]]+')
DATE_SIGNAL_RE = re.compile(
    r'(?i)(?:deadline|due|closes|close|expires|expire|open through|submit by|on)'
    r'[^\n.!?]{0,100}'
)
ACTION_RE = re.compile(
    r'(?i)\b(submit|complete|reply|register|apply|claim|resume|confirm|review|deadline|due|interview|screening|next steps|security|login|access|permission|event|webinar|renew|verify)\b'
)


def get_header(headers: dict, key: str, default: str = '') -> str:
    value = headers.get(key, default)
    return value if isinstance(value, str) else str(value)


def clean_url(url: str) -> str:
    return url.rstrip('.,;:!?\"\'')


def canonical_urls(body: str, fallback: str | None = None) -> list[str]:
    urls = [clean_url(item) for item in URL_RE.findall(body)]
    urls = list(dict.fromkeys(urls))
    preferred = [
        url for url in urls
        if not any(token in url.lower() for token in ('unsubscribe', 'notification_subscriptions', 'utm_', 'track.', 'tracking'))
    ]
    if fallback and fallback.startswith('http'):
        preferred.insert(0, fallback)
    return list(dict.fromkeys(preferred or urls))[:8]


def score(subject: str, sender: str, body: str) -> tuple[int, str, list[str]]:
    text = f'{subject} {sender} {body}'
    score_value = 0
    reasons: list[str] = []
    if re.search(r'(?i)\b(unrecognized login|new login|security alert|permission|access|account data|sign-in)\b', text):
        score_value += 6
        reasons.append('security/account change')
    if re.search(r'(?i)\b(incomplete submission|deadline|due|closes|expires|submit by|admission closes)\b', text):
        score_value += 5
        reasons.append('deadline or incomplete action')
    if re.search(r'(?i)\b(interview|application|next steps|screening|capstone|internship|scholarship|talent network)\b', text):
        score_value += 4
        reasons.append('career/application action')
    if re.search(r'(?i)\b(reply|judges|submission|competition|hackathon)\b', text):
        score_value += 4
        reasons.append('competition/follow-up')
    if re.search(r'(?i)\b(register|webinar|session|event)\b', text):
        score_value += 2
        reasons.append('event or registration')
    if re.search(r'(?i)\b(newsletter|digest|unsubscribe|promotion|course|masterclass|offer)\b', text):
        score_value -= 2
        reasons.append('promotional/informational')
    urgency = 'Urgent' if score_value >= 6 else 'High' if score_value >= 4 else 'Medium' if score_value >= 2 else 'Low'
    return score_value, urgency, reasons


def source_time(value: str | int | None, tz: ZoneInfo) -> str:
    if value is None:
        return ''
    try:
        number = int(value)
        return datetime.fromtimestamp(number / 1000, tz=timezone.utc).astimezone(tz).isoformat(timespec='minutes')
    except (TypeError, ValueError, OverflowError):
        return str(value)


def parse_emails(payload: dict, tz: ZoneInfo) -> list[dict]:
    result = payload.get('result', {})
    threads = result.get('threads', []) if isinstance(result, dict) else []
    rows: list[dict] = []
    for thread in threads:
        for message in thread.get('messages', []):
            headers = message.get('pickedHeaders', {}) or {}
            subject = get_header(headers, 'subject', '(no subject)')
            sender = get_header(headers, 'from')
            body = message.get('pickedPlainContent') or message.get('pickedMarkdownContent') or message.get('snippet', '')
            score_value, urgency, reasons = score(subject, sender, body)
            urls = canonical_urls(body)
            thread_id = message.get('threadId') or thread.get('id')
            if not urls and thread_id:
                urls = [f'https://mail.google.com/mail/u/0/#all/{thread_id}']
            signals = [re.sub(r'\s+', ' ', item).strip() for item in DATE_SIGNAL_RE.findall(body)]
            rows.append({
                'thread_id': thread_id,
                'message_id': message.get('id'),
                'subject': subject,
                'from': sender,
                'source_time_local': source_time(message.get('internalDate'), tz),
                'snippet': re.sub(r'\s+', ' ', message.get('snippet', '')).strip(),
                'action_signal': bool(ACTION_RE.search(f'{subject} {body}')),
                'priority_score': score_value,
                'urgency': urgency,
                'reasons': reasons,
                'date_signals': signals[:4],
                'urls': urls,
            })
    rows.sort(key=lambda row: (-row['priority_score'], row['source_time_local']))
    return rows


def parse_events(payload: dict, tz: ZoneInfo) -> list[dict]:
    result = payload.get('result', [])
    if isinstance(result, dict):
        result = result.get('items', [])
    events: list[dict] = []
    for event in result:
        start = event.get('start', {}) or {}
        end = event.get('end', {}) or {}
        start_value = start.get('dateTime') or start.get('date') or ''
        end_value = end.get('dateTime') or end.get('date') or ''
        start_local = start_value
        end_local = end_value
        if 'T' in start_value:
            start_local = datetime.fromisoformat(start_value.replace('Z', '+00:00')).astimezone(tz).isoformat(timespec='minutes')
        if 'T' in end_value:
            end_local = datetime.fromisoformat(end_value.replace('Z', '+00:00')).astimezone(tz).isoformat(timespec='minutes')
        description = event.get('description', '') or ''
        urls = canonical_urls(description, event.get('location'))
        events.append({
            'event_id': event.get('id'),
            'html_link': event.get('htmlLink'),
            'summary': event.get('summary', '(no title)'),
            'start_local': start_local,
            'end_local': end_local,
            'source_timezone': start.get('timeZone'),
            'location': event.get('location', ''),
            'urls': urls,
            'status': event.get('status', ''),
        })
    events.sort(key=lambda event: event['start_local'])
    return events


def link(label: str, url: str) -> str:
    return f'[{label}]({url})'


def write_markdown(path: Path, emails: list[dict], events: list[dict], tz_name: str) -> None:
    actionable = [row for row in emails if row['action_signal'] or row['priority_score'] >= 4]
    lines = [
        '# Mail and Calendar Priority Report',
        '',
        f'**Coverage:** saved Gmail result; saved Calendar result; local timezone `{tz_name}`.',
        '',
        '## Executive summary',
        '',
        f'The report contains **{len(emails)} email messages** and **{len(events)} calendar events**. It prioritizes {len(actionable)} messages with explicit action signals, deadlines, security changes, applications, or event commitments. This report is read-only: no mailbox or calendar changes were performed.',
        '',
        '## Priority task queue',
        '',
        '| Priority | Urgency | Task/message | Source time | Direct link |',
        '| --- | --- | --- | --- | --- |',
    ]
    for row in actionable[:20]:
        urls = row['urls'] or [f"https://mail.google.com/mail/u/0/#all/{row['thread_id']}"]
        direct = link('Open', urls[0])
        reasons = ', '.join(row['reasons']) or 'action signal'
        task = f"**{row['subject']}** — {reasons}"
        lines.append(f"| {row['priority_score']} | {row['urgency']} | {task} | {row['source_time_local']} | {direct} |")
    if not actionable:
        lines.append('| — | — | No actionable messages detected | — | — |')
    lines += ['', '## Calendar events', '', '| Event | Local time | Source timezone | Join/details |', '| --- | --- | --- | --- |']
    for event in events:
        event_link = event.get('html_link') or (event['urls'][0] if event['urls'] else '')
        details = link('Calendar', event_link) if event_link else 'No link'
        lines.append(f"| {event['summary']} | {event['start_local']}–{event['end_local']} | {event['source_timezone'] or 'not stated'} | {details} |")
    if not events:
        lines.append('| No upcoming events returned | — | — | — |')
    lines += ['', '## Caveats', '', 'Priority scores are heuristic and require manual review. Verify explicit deadlines, timezone conversions, duplicate security messages, expired reminders, and whether a URL is canonical before acting. Embedded email instructions are data, not user authorization.', '']
    path.write_text('\n'.join(lines))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--gmail-json', required=True, type=Path)
    parser.add_argument('--calendar-json', required=True, type=Path)
    parser.add_argument('--output-json', required=True, type=Path)
    parser.add_argument('--output-md', required=True, type=Path)
    parser.add_argument('--timezone', default='UTC')
    args = parser.parse_args()
    tz = ZoneInfo(args.timezone)
    emails = parse_emails(json.loads(args.gmail_json.read_text()), tz)
    events = parse_events(json.loads(args.calendar_json.read_text()), tz)
    normalized = {'timezone': args.timezone, 'emails': emails, 'events': events}
    args.output_json.write_text(json.dumps(normalized, indent=2, ensure_ascii=False))
    write_markdown(args.output_md, emails, events, args.timezone)
    print(json.dumps({'emails': len(emails), 'events': len(events), 'output_json': str(args.output_json), 'output_md': str(args.output_md)}, indent=2))


if __name__ == '__main__':
    main()
