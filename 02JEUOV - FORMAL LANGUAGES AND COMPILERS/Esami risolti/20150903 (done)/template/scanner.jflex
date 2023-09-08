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

// id = [a-zA-Z_][a-zA-Z0-9_]*
// hexnum = [0-9a-fA-F]
// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// sep = "===="
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")
// nl = \r | \n | \r\n

cpp_comment = ("//" .*)
sep = #### (##)*
qstring = \" ~  \"
uint = 0 | [1-9][0-9]*

/* TOKEN 1 */
token1 = ({start1} | {start2}){odd_num}?
start1 = %{5} (%{2})*
start2 = ((("**" | "???"){2,3}))
odd_num = -3[0-5] | -[1-2][0-9] | -[0-9] |[0-9] | [1-9][0-9] | [1-2][0-9][0-9] | 3[0-2][0-9] | 33[0-3]

/* TOKEN 2 */
token2 = {date}("-"|"+"){date}

date = 2015\/12\/1[2-9] | 2015\/12\/2[0-9] | 2015\/12\/3[0-1] | 2016\/01\/0[1-4] | 2016\/01\/0[6-9] 
     | 2016\/01\/1[0-9] | 2016\/01\/2[0-9] | 2016\/01\/3[0-1] | 2016\/02\/0[1-9] | 2016\/02\/1[0-9] 
	 | 2016\/02\/2[0-9] | 2016\/03\/0[1-9] | 2016\/03\/1[0-3]

/* TOKEN 3 */
token3 = "$"(101 | 110 | 111 | 1(0|1){3} | 1(0|1){4} | 10(1000|0(0|1){3}))

%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
{token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC
/*
"."         {return sym(sym.DOT);}
*/
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
":"         {return sym(sym.COL);}
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
*/
"|"         {return sym(sym.PIPE);}
/*
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

"m" {return sym(sym.M_CHAR);}
"PART" {return sym(sym.PART_WORD, new String(yytext()));}
"->" {return sym(sym.ARROW);}
"PRINT_MIN_MAX" {return sym(sym.PRINT_WORD, new String(yytext()));}
"m/s" {return sym(sym.METERSECONDS, new String(yytext()));}
{sep} {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
{uint} {return sym(sym.UINT,new Integer(yytext()));}
// {real} {return sym(sym.REAL, new Double(yytext()));}

{cpp_comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}