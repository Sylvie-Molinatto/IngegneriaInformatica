import java_cup.runtime.*;

//jflex scanner.jflex; java java_cup.MainDrawTree parser.cup;javac *.java;java Main example.txt
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
// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// hexnum = [0-9a-fA-F]

// id = [a-zA-Z_][a-zA-Z0-9_]*
// qstring = \" ~  \"

// sep = "===="

// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")

// nl = \r | \n | \r\n
// ws = [ \t]

comment     = "//" .*
id          = [_a-zA-Z][_a-zA-Z0-9]*
word 		= [a-zA-Z]+
uint        = [0-9]+

%%

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
":"         {return sym(sym.COL);}
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
"&&"        {return sym(sym.AND);}
"||"        {return sym(sym.OR);}
"!"         {return sym(sym.NOT);}
"|"         {return sym(sym.PIPE);}
*/
"+"         {return sym(sym.PLUS);}
"-"         {return sym(sym.MINUS);}
"*"         {return sym(sym.STAR);}
"/"         {return sym(sym.DIV);}
"->"        {return sym(sym.ARROW);}
/*
"^"         {return sym(sym.PWR);}
"<"         {return sym(sym.MIN);}
">"         {return sym(sym.MAJ);}
"`"         {return sym(sym.BACKTICK);}
"~"         {return sym(sym.TILDE);}
*/

// {sep} {return sym(sym.SEP);}
// {qstring} {return sym(sym.QSTRING,new String(yytext()));}
// {uint} {return sym(sym.UINT,new Integer(yytext()));}
// {real} {return sym(sym.REAL, new Double(yytext()));}

{comment}   {;}

{uint} {return sym(sym.UINT, new Integer(yytext())); }
{word} {return sym(sym.WORD, new String(yytext()));}
{id}   {return sym(sym.ID, new String(yytext()));}

\n|\r|\r\n 	{;}
[ \t]       {;}