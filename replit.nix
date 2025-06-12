{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}