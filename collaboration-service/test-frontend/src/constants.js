export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
};

export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\n//\n\ngreet("James");\n`,   
    typescript: `\ntype Params = {\n\tname: string;\n};\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\n//\n\ngreet({ name: "James" });\n`,
    python: `\ndef greet(name: str) -> None:\n\tprint(f"Hello, {name}!")\n\n#\n\ngreet("James")\n`,
    java: `\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tgreet("James");\n\t}\n\n\tpublic static void greet(String name) {\n\t\tSystem.out.println("Hello, " + name + "!");\n\t}\n}\n`,
    csharp: `\nclass Program {\n\tstatic void Main() {\n\t\tGreet("James");\n\t}\n\n\tstatic void Greet(string name) {\n\t\tConsole.WriteLine("Hello, " + name + "!");\n\t}\n}\n`,
    php: `\n<?php\n\nfunction greet($name) {\n\techo "Hello, $name!";\n}\n\n//\n\ngreet("James");\n`,
}