#!/usr/bin/env python3
"""
InnovaRT - Patent-Aware Innovation & Commercialization System
CLI entry point
"""

import argparse
import sys
import json

from innovart.orchestrator import InnovaRTOrchestrator
from innovart import config, setup_logging
from innovart.utils import save_json, format_currency


def main():
    parser = argparse.ArgumentParser(
        description="InnovaRT - Patent-Aware Innovation & Commercialization Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                              # Run with default query
  python main.py --query "AI healthcare"      # Custom query
  python main.py --max-results 10             # More results
  python main.py --agent PatentScout           # Run single agent
  python main.py --status                      # Check pipeline status
        """,
    )
    parser.add_argument(
        "--query", "-q",
        default="emerging technologies",
        help="Search query for patent scouting (default: 'emerging technologies')",
    )
    parser.add_argument(
        "--max-results", "-n",
        type=int, default=5,
        help="Maximum number of results per agent (default: 5)",
    )
    parser.add_argument(
        "--agent", "-a",
        default=None,
        help="Run a single agent by name (e.g., PatentScout, ResearchAgent)",
    )
    parser.add_argument(
        "--status", "-s",
        action="store_true",
        help="Show status of all agents in the pipeline",
    )
    parser.add_argument(
        "--output", "-o",
        default="innovart_results.json",
        help="Output file path for pipeline results (default: innovart_results.json)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose/debug logging",
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"InnovaRT {config.version}",
    )

    args = parser.parse_args()

    if args.verbose:
        import logging
        logging.getLogger("innovart").setLevel(logging.DEBUG)

    logger = setup_logging()
    logger.info(f"InnovaRT v{config.version} - Patent-Aware Innovation Pipeline")

    # Single agent mode
    if args.agent:
        logger.info(f"Running single agent: {args.agent}")
        # Single agent execution would require additional setup
        # For now, run the full pipeline
        pass

    # Pipeline status
    if args.status:
        orchestrator = InnovaRTOrchestrator()
        status = orchestrator.get_pipeline_status()
        print("\nPipeline Status:")
        print("=" * 40)
        for name, state in status.items():
            print(f"  {name:<25} {state}")
        print("=" * 40)
        return 0

    # Run full pipeline
    logger.info(f"Query: {args.query}")
    logger.info(f"Max results: {args.max_results}")
    logger.info("-" * 40)

    orchestrator = InnovaRTOrchestrator()
    result = orchestrator.run_pipeline(
        query=args.query,
        max_results=args.max_results,
    )

    # Save results
    orchestrator.save_results(result, args.output)
    save_json(result.to_json(), args.output.replace(".json", "_summary.json"))

    # Print summary
    print("\n" + "=" * 50)
    print("  INNOVART PIPELINE COMPLETE")
    print("=" * 50)
    print(f"  Pipeline ID:    {result.pipeline_id}")
    print(f"  Opportunities:  {len(result.opportunities)}")
    print(f"  Concepts:       {len(result.concepts)}")
    print(f"  Completed:      {result.completed_at}")
    print("-" * 50)

    if result.opportunities:
        print("\n  Top Opportunities:")
        for opp in result.opportunities[:3]:
            print(f"    [{opp.priority.name}] {opp.title}")
            print(f"             Score: {opp.opportunity_score:.2f} | Commercial: {opp.commercial_potential:.2f}")

    if result.concepts:
        print("\n  Innovation Concepts:")
        for concept in result.concepts[:3]:
            print(f"    [{concept.priority.name}] {concept.title}")
            print(f"             Novelty: {concept.novelty_score:.2f}")

    print(f"\n  Results saved to: {args.output}")
    print("=" * 50)

    return 0


if __name__ == "__main__":
    sys.exit(main())
