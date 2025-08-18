def generate_ast(expression):
    """Generates a textual representation of the AST for a given expression."""

    def tokenize(expression):
        """Tokenizes the input expression."""
        tokens = []
        i = 0
        while i < len(expression):
            if expression[i].isdigit():
                num = ""
                while i < len(expression) and expression[i].isdigit():
                    num += expression[i]
                    i += 1
                tokens.append(("NUMBER", num))
                i -= 1  # Correct the index after reading the number
            elif expression[i] in "+-*/()":
                tokens.append((expression[i], expression[i]))
            elif expression[i].isspace():
                pass
            i += 1
        return tokens

    def build_ast(tokens):
        """Builds the AST based on operator precedence."""
        def parse(tokens):
            if not tokens:
                return None, []

            # Addition and Subtraction
            for i in range(len(tokens), 0, -2):
                if i > 0 and isinstance(tokens[i-1], tuple) and tokens[i-1][0] == "+":
                    left = parse(tokens[:i])
                    right = parse(tokens[i+1:])
                    return ('+', left[0], left[1]), right

            # Multiplication and Division
            for i in range(len(tokens), 0, -2):
                if i > 0 and isinstance(tokens[i-1], tuple) and tokens[i-1][0] == "*":
                    left = parse(tokens[:i])
                    right = parse(tokens[i+1:])
                    return ('*', left[0], left[1]), right

            # Parentheses
            for i in range(len(tokens), 0, -2):
                if i > 0 and isinstance(tokens[i-1], tuple) and tokens[i-1][0] == "(":
                    inner_ast, remaining_tokens = parse(tokens[:i])
                    return ("(", inner_ast), remaining_tokens

            # Handle the case when there's only one token left
            if len(tokens) == 1:
                if tokens[0][0] == "NUMBER":
                    return tokens[0][1], []
                else:
                    return None, []

            return None, []  # Return a default value for AST
        ast = parse(tokens)
        return ast


    def print_ast(ast, indent=0):
        """Prints the AST with indentation."""
        if ast is None:
            return

        if isinstance(ast, tuple):
            print("  " * indent + str(ast[0]))
            print_ast(ast[1], indent + 1)
            print_ast(ast[2], indent + 1)
        else:
            print("  " * indent + str(ast))

    tokens = tokenize(expression)
    ast = build_ast(tokens)
    print_ast(ast)  # Call print_ast here

# Example usage:
expression = "1 + 2 * 3"
print(f"AST for '{expression}':")
generate_ast(expression)

expression = "(1 + 2) * 3"
print(f"\nAST for '{expression}':")
generate_ast(expression)

expression = "12 + (3 * 4) - 5"
print(f"\nAST for '{expression}':")
generate_ast(expression)
```

