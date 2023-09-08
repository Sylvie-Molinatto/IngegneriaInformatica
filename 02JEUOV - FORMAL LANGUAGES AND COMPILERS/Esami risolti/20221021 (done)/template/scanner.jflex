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

sep = "$$$"
comment = ("{++" ~ "++}")

/* TOKEN 1 */
token1 = \?{word}{octal}{oth_words}?

word = [A-Z]{6} | [A-Z]{6}([A-Z]{2})*

octal = -1[0-2][0-7] | -[1-7][0-7] | -[0-7] | [0-7] | [1-7][0-7] | [1-2][0-7][0-7] | 3[0-1][0-7] | 32[0-3]

oth_words = [xx|yy|zz]{4} | ["xx"|"yy"|"zz"]{4}("xx"|"yy"|"zz")*

/* TOKEN 2 */
token2=({email}{email_seq} | {email}{email_seq}{11} | {email}{email_seq}{14})

email_seq = ("!"|"/"){email}

email = ([a-zA-Z0-9_\.]+"@"[a-zA-Z0-9]+"."("it"|"org"|"com"|"net"))


%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
"tk3"     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC
/*
"."         {return sym(sym.DOT);}
*/
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
/*
":"         {return sym(sym.COL);}
*/
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
"["         {return sym(sym.SO);}
"]"         {return sym(sym.SC);}
/*
"{"         {return sym(sym.BO);}
"}"         {return sym(sym.BC);}
*/
"="         {return sym(sym.EQ);}
/*
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
"CMP"       {return sym(sym.CMP);}
"WITH"      {return sym(sym.WITH);}
"print"     {return sym(sym.PRINT);}
"AND"       {return sym(sym.AND);}
"OR"        {return sym(sym.OR);}
"NOT"       {return sym(sym.NOT);}
"T"         {return sym(sym.T);}
"F"         {return sym(sym.F);}
"fz_and"    {return sym(sym.FZFUNCTION);}

{sep}      {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
// {uint} {return sym(sym.UINT,new Integer(yytext()));}
// {real} {return sym(sym.REAL, new Double(yytext()));}
{id}      {return sym(sym.ID, new String(yytext()));}

{comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}