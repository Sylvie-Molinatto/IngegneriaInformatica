import java_cup.runtime.*;

%%

%unicode
%cup
%line
%column

%{
    private Symbol sym(int type){
	    return new Symbol(type, yyline, yycolumn);
	}
	private Symbol sym(int type, Object value){
	    return new Symbol(type, yyline, yycolumn, value);
	}
%}

uint = 0 | [1-9][0-9]*
id = [a-zA-Z_][a-zA-Z0-9_]*
// hexnum = [0-9a-fA-F]
// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")
// nl = \r | \n | \r\n

sep = \$\$
comment = ("(++" ~ "++)")

/* TOKEN 1 */
token1 = ({word}\#{hexnum}?)

word = ([abc]{7}) ([abc]{2})*

// hex even number from -5C aB6
evenNumbers = [02468AaCcEe]
allNumbers = [0-9aA-Fa-f]
hexnum = -5[02468AaCc] | -[1-4]{evenNumbers} | -{evenNumbers} | {evenNumbers} | 
         [1-9a-fA-F]{evenNumbers} | [1-9]{allNumbers}{evenNumbers} | [aA][0-9a-bA-B][0246]


/* TOKEN 2 */
token2 = ({hour}\:{bin})

// hour between 07:13:24 and 17:37:43
hour = "07:13:2"[4-9] |  "07:13:"[3-5][0-9] |"07:1"[4-9]\:[0-5][0-9] | "07:"[2-5][0-9]\:[0-5][0-9] 
     | "0"[89]\:[0-5][0-9]\:[0-5][0-9] | "1"[0-6]\:[0-5][0-9]\:[0-5][0-9] | "17"\:[0-2][0-9]:[0-5][0-9]
	 | "17:3"[0-6]\:[0-5][0-9] | "17:37:"[0-3][0-9] | "17:37:4"[0-3]
       

// bin number between 101 and 11010
bin = "101" | 11[0-1] | 1[0-1][0-1] | 1[0-1][0-1][0-1] | 10[0-1][0-1][0-1] | 
      "11000" | "11001" | "11010"



%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
// {token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC
/*
"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
*/
";"         {return sym(sym.S);}
/*
":"         {return sym(sym.COL);}
*/
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
/*
"["         {return sym(sym.SO);}
"]"         {return sym(sym.SC);}
*/
"{"         {return sym(sym.BO);}
"}"         {return sym(sym.BC);}
"="         {return sym(sym.EQ);}
/*
"=="        {return sym(sym.EQEQ);}
"!="        {return sym(sym.NEQ);}
"&&"        {return sym(sym.AND);}
"||"        {return sym(sym.OR);}
"!"         {return sym(sym.NOT);}
"|"         {return sym(sym.PIPE);}
*/
"+"         {return sym(sym.PLUS);}
"-"         {return sym(sym.MINUS);}
"*"         {return sym(sym.STAR);}
"/"         {return sym(sym.DIV);}
/*
"^"         {return sym(sym.PWR);}
"<"         {return sym(sym.MIN);}
">"         {return sym(sym.MAJ);}
"`"         {return sym(sym.BACKTICK);}
"~"         {return sym(sym.TILDE);}
*/

"compare" {return sym(sym.COMPARE);}
"with"    {return sym(sym.WITH);}
"end"     {return sym(sym.END);}
"print"   {return sym(sym.PRINT);}
{sep} {return sym(sym.SEP);}
{id} {return sym(sym.ID, new String(yytext()));}
// {qstring} {return sym(sym.QSTRING,new String(yytext()));}
{uint} {return sym(sym.UINT,new Integer(yytext()));}
// {real} {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}