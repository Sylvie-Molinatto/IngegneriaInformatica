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
uint = 0 | [1-9][0-9]*
real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
qstring = \" ~  \"
// sep = "===="
// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)

/* TOKEN 1 */
token1 = X_((({bin}{sepb}){3}) | (({bin}{sepb}){12}) | (({bin}{sepb}){15}) )

bin = (101) | (11[0-1]) | (1[0-1][0-1][0-1]) | (1[0-1][0-1][0-1][0-1]) | 
      (1[0-1][0-1][0-1][0-1][0-1]) | (100[0-1][0-1][0-1][0-1]) | 
	  (1010[0-1][0-1][0-1]) | (10110[0-1][0-1]) 

sepb = (\+ | \*)

/* TOKEN 2 */
token2 = Y_( ({wd}{sepwd}{wd}) | ({wd}(({sepwd}{wd}){4})) )

wd = ((x | y | z){6}) ((x | y | z){2})*

sepwd = (\$ | \#)

/* TOKEN 3 - 2022/09/10 - 2023/03/15 -- 09:11 - 17:13 */
token3 = Z_{date}((\:{hour})?)

date = (2022 \/ ( (09\/1[0-9]) | (09\/2[0-9]) | (09\/30) | (1[0-2]\/0[1-9]) | (1[0-2]\/[1-2][0-9]) | 
       (11\/30) | (10\/3[0-1]) | (12\/3[0-1]) ))| (2023\/( (0[1-3]\/0[1-9]) | (0[1-2]\/1[0-9]) | (02\/2[0-8]) |
	   (01\/2[0-9]) | (01\/3[0-1]) | (03\/1[0-5]) ))

hour = (09\:1[1-9]) | (09\:[2-5][0-9]) | (1[0-6]\:[0-5][0-9]) | (17\:0[0-9]) | (17\:1[0-3])


sep = "===="

nl = \r | \n | \r\n
comment = ("(+-" ~ "-+)")


%%
{sep}        {return sym(sym.SEP);}

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
/*
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
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

"TO"      {return sym(sym.TO_WD,new String(yytext()));}
"km"      {return sym(sym.KM_WD,new String(yytext()));}
"m"       {return sym(sym.METERS,new String(yytext()));}
"ELEVATION"      {return sym(sym.ELEVATION,new String(yytext()));}
"ROUTE"      {return sym(sym.ROUTE,new String(yytext()));}
"kcal/km"      {return sym(sym.KCAL,new String(yytext()));}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
{real} {return sym(sym.REAL, new Double(yytext()));}
{uint} {return sym(sym.UINT,new Integer(yytext()));}

{comment} {;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}