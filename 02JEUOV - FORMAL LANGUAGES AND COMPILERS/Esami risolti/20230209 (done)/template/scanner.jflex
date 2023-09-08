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
// id = [a-zA-Z_][a-zA-Z0-9_]*
// hexnum = [0-9a-fA-F]
real = ((0\.[0-9]+) | [1-9][0-9]*\.[0-9]{2} | \.[0-9]+)
qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")
// nl = \r | \n | \r\n

sep = "$$$$"("$$")*
comment = ("(*-" ~ "-*)")

/* TOKEN 1 */
token1 = {word}{hexnum}{hexnum_seq}{2} | {word}{hexnum}{hexnum_seq}{5}

word = ["%*"|"*%"|"%%"]{6,17}

hexnum_seq = ("+"){hexnum}

hexnum = [1-9a-fA-F][0-9a-fA-F] | [1-9a-fA-F][0-9a-fA-F][0-9a-fA-F] | [1-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]

/* TOKEN 2 */
token2 = {date}("$"|"%"){date}("$"| "%"){date}("-"{bin})?

date = 2022\/11\/1[5-9] | 2022\/11\/2[0-9] | 2022\/11\/30 | 2022\/12\/0[1-9] | 2022\/12\/1[0-2] | 2022\/12\/1[4-9]
     | 2022\/12\/2[0-9] | 2022\/12\/3[0-1] | 2023\/0[1-2]\/0[1-9] | 2023\/02\/1[0-3] | 2023\/02\/1[5-9] | 2023\/01\/1[0-19]
	 | 2023\/02\/2[0-8] | 2023\/01\/2[0-9] | 2021\/01\/3[0-1] | 2023\/03\/0[1-9] | 2023\/03\/1[0-9] | 2023\/03\/2[0-9] | 2023\/03\/30

bin = 1011 | 1111 | 10[0-1][0-1][0-1] | 101[0-1][0-1] | 1011[0-1]

%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
// {token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
":"         {return sym(sym.COL);}
/*
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
*/
"["         {return sym(sym.SO);}
"]"         {return sym(sym.SC);}
/*
"{"         {return sym(sym.BO);}
"}"         {return sym(sym.BC);}
"="         {return sym(sym.EQ);}
"=="        {return sym(sym.EQEQ);}
"!="        {return sym(sym.NEQ);}
"&&"        {return sym(sym.AND);}
"||"        {return sym(sym.OR);}
"!"         {return sym(sym.NOT);}
"|"         {return sym(sym.PIPE);}
"+"         {return sym(sym.PLUS);}
"-"         {return sym(sym.MINUS);}
"*"         {return sym(sym.STAR);}
"/"         {return sym(sym.DIV);}
"^"         {return sym(sym.PWR);}
"<"         {return sym(sym.MIN);}
">"         {return sym(sym.MAJ);}
"`"         {return sym(sym.BACKTICK);}
"~"         {return sym(sym.TILDE);}
*/
"EURO/kg"   {return sym(sym.EUROKG);}
"kg"        {return sym(sym.KG);}

{sep}     {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
{uint}    {return sym(sym.UINT,new Integer(yytext()));}
{real}    {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}