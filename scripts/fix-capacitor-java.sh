 #!/usr/bin/env bash
  set -euo pipefail

  root_dir="$(cd "$(dirname "$0")/.." && pwd)"

  patch_file() {
    local file="$1"
    if [[ -f "$file" ]]; then
      perl -0pi -e 's/VERSION_21/VERSION_17/g' "$file"
    fi
  }

  patch_file "$root_dir/android/app/capacitor.build.gradle"

  find "$root_dir/node_modules/@capacitor" -type f -name build.gradle -print0 | while IFS= read -r -d '' file; do
    patch_file "$file"
  done

