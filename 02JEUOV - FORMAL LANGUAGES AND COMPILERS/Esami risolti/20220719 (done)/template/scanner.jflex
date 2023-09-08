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
// id = [a-zA-Z_][a-zA-Z0-9_]*
// hexnum = [0-9a-fA-F]
real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")
// nl = \r | \n | \r\n

sep = "%%%%" | "%%%%" ("%%")*
cpp_comment = "(((-" ~ "-)))"
comment = ("---".*)

/* TOKEN 1 */
token1 = A_({bin}|{sym_wd})

bin = ([1]*0[1]*0[1]*)|([1]*0[1]*0[1]*0[1]*0[1]*0[1]*)

sym_wd = ({sym_1} | {sym_1}{sym_4} | {sym_2} | {sym_2}{sym_3} | {sym_3} | {sym_4})

sym_1 = ("*+")*

sym_2 = ("+*")*

sym_3 = "+"

sym_4 = "*"

/* TOKEN 2 */
token2 = B_{word_seq}

word_seq = ({word}("+"|"*"|"$")){3}{word} | ({word}("+"|"*"|"$")){3}{word} (("+"|"*"|"$"){word}("+"|"*"|"$"){word})*

word = -3[0|2] | -[1-2]{even_num} | -[2468] | [0] | [2468] | [1-9]{even_num} | [1-9][0-9]{even_num}
     | 1[0-1][0-9]{even_num} | 12[0-3]{even_num} | 124[0246]

even_num = [02468]
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
"-"     {return sym(sym.DASH);}
"START" {return sym(sym.START);}
"BATTERY" {return sym(sym.BATTERY);}
"kWh"     {return sym(sym.KWH);}
"FUEL"    {return sym(sym.FUEL);}
"liters"  {return sym(sym.LITERS);}
"PLUS"    {return sym(sym.PLUS_WD);}
"STAR"    {return sym(sym.STAR_WD);}
"MAX"     {return sym(sym.MAX_WD);}
"MOD"     {return sym(sym.MOD);}
"USE"     {return sym(sym.USE);}
"DO"      {return sym(sym.DO);}
"DONE"    {return sym(sym.DONE);}
"km"      {return sym(sym.KM);}
"units/km" {return sym(sym.UNITSKM);}
{sep} {return sym(sym.SEP);}
// {qstring} {return sym(sym.QSTRING,new String(yytext()));}
// {uint} {return sym(sym.UINT,new Integer(yytext()));}
{real} {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}
{cpp_comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}