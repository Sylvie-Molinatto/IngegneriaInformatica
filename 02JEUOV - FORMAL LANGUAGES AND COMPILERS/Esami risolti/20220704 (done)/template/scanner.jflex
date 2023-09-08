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

// uint = 0 | [1-9][0-9]*
id = [a-zA-Z_][a-zA-Z0-9_]*
// hexnum = [0-9a-fA-F]
// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")
// nl = \r | \n | \r\n

sep = "===="
comment = ("[[--" ~ "--]]")

/* TOKEN 1 */
token1 = D-{date}(-{date})?

date = 0[4-9]\/July\/2022 | 0[1-9]\/("August" | "September" | "October" | "November" | "December")\/2022 
     | [1-2][0-9]\/("July" | "August" | "September" | "October" | "November" | "December")\/2022 
     | 3[0-1]\/("July"| "August" | "October" | "December")\/2022 | 30\/("September" | "November")\/2022
	 | 0[1-9]\/January\/2023 | 1[0-5]\/January\/2023 

/* TOKEN 2 */
token2 = R-{words}{q_marks}?

words = (("XX"| "YY" | "ZZ"){4,15})

q_marks = "????" ("??")*

/* TOKEN 3 */
token3 = N-{hex}

hex = ({hexnum}("+"|"/"|"*")){4}{hexnum} | ({hexnum}("+"|"/"|"*")){4}{hexnum} ((("+"|"/"|"*")){hexnum}(("+"|"/"|"*")){hexnum})*

hexnum = 2[A-Fa-f] | [3-9a-fA-F][0-9a-fA-F] | [1-9aA][0-9a-fA-F][0-9a-fA-F] | [bB][0-9a-bA-B][0-9a-fA-F] | [bB][cC][0-3]

%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
{token3}     {return sym(sym.TK3);}  

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
"{"         {return sym(sym.BO);}
"}"         {return sym(sym.BC);}
*/
"="         {return sym(sym.EQ);}
/*
"=="        {return sym(sym.EQEQ);}
"!="        {return sym(sym.NEQ);}
*/
"&"        {return sym(sym.AND);}
"|"        {return sym(sym.OR);}
"!"         {return sym(sym.NOT);}
/*
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

"TRUE" {return sym(sym.TRUE);}
"FALSE" {return sym(sym.FALSE);}
"IF" {return sym(sym.IF);}
"FI" {return sym(sym.FI);}
"DO" {return sym(sym.DO);}
"PRINT" {return sym(sym.PRINT);}
"DONE" {return sym(sym.DONE);}
"AND" {return sym(sym.AND_WORD);}
"OR" {return sym(sym.OR_WORD);}
{sep} {return sym(sym.SEP);}
{id} {return sym(sym.ID);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
// {uint} {return sym(sym.UINT,new Integer(yytext()));}
// {real} {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}