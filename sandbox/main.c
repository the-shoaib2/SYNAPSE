#include <stdio.h>
#include <stdlib.h>
#include "calculator.tab.h"

extern FILE *yyin;

int main() {
    char input[1024];
    printf("Enter an arithmetic expression: ");
    fgets(input, 1024, stdin);

    yyin = fmemopen(input, strlen(input), "r");
    if (!yyin) {
        perror("fmemopen");
        return 1;
    }
    yyparse();
    fclose(yyin);

    return 0;
}
