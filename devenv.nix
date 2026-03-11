{ pkgs, lib, config, ... }:

# ============================================================================
# devenv.nix - PRESO Development Environment
# ============================================================================
#
# Development environment for the preso CLI.
# For end users, the standalone `preso` binary is recommended.
#
# QUICK REFERENCE
# ============================================================================
#
# CLI DEVELOPMENT
#   preso-dev <cmd>      Run CLI in development mode (e.g., preso-dev serve)
#   preso-build          Build standalone binary for current platform
#   preso-build-all      Build for all platforms
#   bun test             Run tests
#   bun test --coverage  Run tests with coverage
#
# LINTING & FORMATTING
#   bun run lint         Lint and format code
#   bun run lint:check   Check without fixing
#   bun run typecheck    Type-check the source code
#
# ============================================================================

{
  cachix.enable = false;

  # ============================================================================
  # PACKAGES
  # ============================================================================
  packages = [
    pkgs.jq
    pkgs.curl
    pkgs.bun
    pkgs.biome
  ];

  # ============================================================================
  # LANGUAGES (Bun handles JavaScript/TypeScript)
  # ============================================================================
  languages.javascript = {
    enable = true;
    bun = {
      enable = true;
      install.enable = true;
    };
  };

  # ============================================================================
  # SCRIPTS - CLI Development
  # ============================================================================

  scripts.preso-dev = {
    exec = ''
      bun run src/cli/index.ts "$@"
    '';
    description = "Run preso CLI in development mode";
  };

  scripts.preso-build = {
    exec = ''
      bun run scripts/build.ts "$@"
    '';
    description = "Build standalone preso binary for current platform";
  };

  scripts.preso-build-all = {
    exec = ''
      bun run scripts/build.ts --all
    '';
    description = "Build standalone preso binaries for all platforms";
  };

  # ============================================================================
  # SHELL ENTRY
  # ============================================================================
  enterShell = ''
    echo ""
    echo "PRESO Development Environment"
    echo "=============================="
    echo ""
    echo "CLI Development:"
    echo "  preso-dev <cmd>      Run CLI in dev mode (e.g., preso-dev serve)"
    echo "  preso-build          Build binary for current platform"
    echo "  preso-build-all      Build binaries for all platforms"
    echo ""
    echo "Testing & Linting:"
    echo "  bun test             Run tests"
    echo "  bun test --coverage  Run tests with coverage"
    echo "  bun run lint         Lint and format code"
    echo "  bun run typecheck    Type-check source code"
    echo ""
    echo "Example workflow:"
    echo "  mkdir my-talk && cd my-talk"
    echo "  preso-dev init"
    echo "  preso-dev serve"
    echo ""
  '';
}
