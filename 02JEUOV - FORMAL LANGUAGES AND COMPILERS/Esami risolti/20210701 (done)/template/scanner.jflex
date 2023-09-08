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
// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
real = (([0-9]\.[0-9][0-9]) | [1-9][0-9]*\.[0-9][0-9])
qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")

ws = [ \t]
nl = \r | \n | \r\n

sep = "####"
comment = ("(*" ~ "*)")

/* TOKEN 1 */
token1 = X-{hour}{words}*

hour = 03:51:4[7-9] | 03:51:5[0-9] | 03:5[2-9]:[0-5][0-9] | [4-9]:[0-5][0-9]:[0-5][0-9] 
     | 1[0-9]:[0-5][0-9]:[0-5][0-9] | 2[0-2]:[0-5][0-9]:[0-5][0-9] | 23:[0-3][0-9]:[0-5][0-9] 
	 | 23:4[0-4]:[0-5][0-9] |23:45:[0-2][0-9] |  23:45:[0-3][0-4]

words = (("aa" | "ab" | "ba" | "bb"){5}) | (("aa" | "ab" | "ba" | "bb"){5} (("aa" | "ab" | "ba" | "bb"){2}*))

/* TOKEN 2 */
token2 = Y-({bin_4} | {bin_123})

bin_4 = {bin}-{bin}-{bin}-{bin}

bin_123 = ({bin}-{bin}-{bin}-){40}({bin}-{bin}-{bin})

//bin_257 = ({bin}-{bin}){128}(-{bin})

bin = 101 | 110 | 111 | 1[0-1][0-1][0-1] | 1[0-1][0-1][0-1][0-1] | 1[0-1][0-1][0-1][0-1][0-1] | 10[0-1]000[0-1]

%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
// {token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC
/*
"."         {return sym(sym.DOT);}
*/
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
":"         {return sym(sym.COL);}
/*
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
"["         {return sym(sym.SO);}
"]"         {return sym(sym.SC);}
*/
"{"         {return sym(sym.BO);}
"}"         {return sym(sym.BC);}
/*
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

"euro/kg" {return sym(sym.EURO_KG);}
"euro" {return sym(sym.EURO);}
"kg" {return sym(sym.KG);}
{sep} {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
{uint} {return sym(sym.UINT,new Integer(yytext()));}
{real} {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}

{ws}|{nl}|" "   	{;}

.           {System.out.println("Scanner error: " + yytext());}