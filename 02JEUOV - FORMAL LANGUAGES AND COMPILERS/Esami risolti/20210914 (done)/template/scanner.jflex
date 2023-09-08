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
// qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")
// nl = \r | \n | \r\n

sep = "===="
comment = ("+--" ~ "--+")

/* TOKEN 1 */
token1 = I_{date}(:{hour})?

// between 03/09/2021 and 05/03/2022
date = 0[3-9]\/09\/2021 | [1-2][0-9]\/09\/2021 | 30\/09\/2021 | 0[1-9]\/10\/2021 | [1-2][0-9]\/10\/2021 | 3[0-1]\/10\/2021 
     | 0[1-9]\/11\/2021 | [1-2][0-9]\/11\/2021 | 30\/11\/2021 | 0[1-9]\/12\/2021 | [1-2][0-9]\/12\/2021 | 3[0-1]\/12\/2021 
     | 0[1-9]\/01\/2022 | [1-2][0-9]\/01\/2022 | 3[0-1]\/01\/2022 | 0[1-9]\/02\/2022 | 1[0-9]\/02\/2022 | 2[0-8]\/02\/2022 | 0[1-5]\/03\/2022

hour = 0[8-9]:[0-5][0-9] | 1[0-6]:[0-5][0-9] | 17:[0-2][0-9] | 17:3[0-5]

/* TOKEN 2 */
token2= J_{hex_seq}

hexnum = 3[b-fB-F] | [4-9A-Fa-f][0-9a-fA-F] | [1-9][0-9a-fA-F][0-9a-fA-F] | [aA][0-9a-dA-D][0-9a-fA-F] | [aA][Ee][0-3]

hex_seq =  (({hexnum}["+" | "-" | "*"])){5}{hexnum}| (({hexnum}["+" | "-" | "*"])){5} ((({hexnum}["+" | "-" | "*"])){2})*{hexnum}


/* TOKEN 3 */
token3 = K_{word}

word = [a-z]{5} ([a-z]{2})* (("00"|"11"|"10"|"01"){3} ("00"|"11"|"10"|"01")*)?

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
/*
":"         {return sym(sym.COL);}
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
*/
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
*/
">"         {return sym(sym.MAJ);}
/*
"`"         {return sym(sym.BACKTICK);}
"~"         {return sym(sym.TILDE);}
*/
"INIT" {return sym(sym.INIT_WD);}
"HEIGHT" {return sym(sym.HEIGHT_WD);}
"SPEED" {return sym(sym.SPEED_WD);}
"SUM" {return sym(sym.SUM);}
"MUL" {return sym(sym.MUL);}
"COND" {return sym(sym.COND_WD);}
"UPDATE" {return sym(sym.UPDATE_WD);}
"DONE" {return sym(sym.DONE);}
{sep} {return sym(sym.SEP);}
// {qstring} {return sym(sym.QSTRING,new String(yytext()));}
{uint} {return sym(sym.UINT,new Integer(yytext()));}
// {real} {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}