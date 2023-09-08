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

uint = 0 | [1-9][0-9]*
// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// hexnum = [0-9a-fA-F]

// id = [a-zA-Z_][a-zA-Z0-9_]*
qstring = \" ~  \"

sep = "$$$" | "$$$" ("$$")*

// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)

comment = ("<*" ~ "*>")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */
token1 = {excl}({number}|{ques});

excl = "!!!!" | "!!!!"("!!")*

ques = "?????" | "?????"("??")*

number = -1[02468] | [02468] | [0-9][02468] | 1[0-9][02468] | 2[0-7][02468] | 28[0246]


/* TOKEN 2 */
token2 = {date};

date = 2023\/07\/0[2-9] | 2023\/07\/[1-2][0-9] | 2023\/07\/3[0-1] | 2023\/0[8-9]\/0[1-9] 
       | 2023\/0[8-9]\/[1-2][0-9]  | 2023\/08\/3[0-1] | 2023\/09\/30 | 2023\/10\/0[1-6]

/* TOKEN 3 */
token3 = {hour_fmt1}; | {hour_fmt2};

hour_fmt1 = 07:37:19 | 07:37:[2-5][0-9] | 07:3[0-9]:[0-5][0-9] | 07:[4-5][0-9]:[0-5][0-9] 
           | 0[8-9]:[0-5][0-9]:[0-5][0-9] | 1[0-9]:[0-5][0-9]:[0-5][0-9] | 2[0-1]:[0-5][0-9]:[0-5][0-9]
		   | 22:[0-2][0-9]:[0-5][0-9] | 22:3[0-8]:[0-5][0-9] | 22:39:[0-1][0-9] | 22:39:2[0-3]

hour_fmt2 = 07:3[7-9] | 07:[4-5][0-9]:[0-5][0-9] | 0[8-9]:[0-5][0-9] | 1[0-9]:[0-5][0-9] 
           | 2[0-1]:[0-5][0-9] | 22:[0-3][0-9] 

%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
{token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
//":"         {return sym(sym.COL);}
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
//"["         {return sym(sym.SO);}
//"]"         {return sym(sym.SC);}
//"{"         {return sym(sym.BO);}
//"}"         {return sym(sym.BC);}
//"="         {return sym(sym.EQ);}
"=="        {return sym(sym.EQEQ);}
//"!="        {return sym(sym.NEQ);}
"and"        {return sym(sym.AND);}
"or"        {return sym(sym.OR);}
"not"         {return sym(sym.NOT);}
//"|"         {return sym(sym.PIPE);}
//"+"         {return sym(sym.PLUS);}
//"-"         {return sym(sym.MINUS);}
//"*"         {return sym(sym.STAR);}
//"/"         {return sym(sym.DIV);}
//"^"         {return sym(sym.PWR);}
//"<"         {return sym(sym.MIN);}
//">"         {return sym(sym.MAJ);}
//"`"         {return sym(sym.BACKTICK);}
//"~"         {return sym(sym.TILDE);}
//"-"         {return sym(sym.DASH);}
//"_"         {return sym(sym.UNDERSCORE);}
//"$"         {return sym(sym.DOLLAR);}
//"€"         {return sym(sym.EURO);}

"house"       {return sym(sym.HOUSE);}
"start"       {return sym(sym.START);}
"end"         {return sym(sym.END);}
"if"          {return sym(sym.IF);}
"then"        {return sym(sym.THEN);}
"fi"          {return sym(sym.FI);}
"print"       {return sym(sym.PRINT);}

{sep}         {return sym(sym.SEP);}
{qstring}     {return sym(sym.QSTRING,new String(yytext()));}
// {id}      {return sym(sym.ID, new String(yytext()));}
{uint}    {return sym(sym.UINT,new Integer(yytext()));}
// {real}    {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}

// {ws}|{nl}|" "   	{;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}