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
// decimal = ((0\.[0-9]{2}) | [1-9][0-9]*\.[0-9]{2} | \.[0-9]{2})
// hexnum = [0-9a-fA-F]

id = [a-zA-Z_][a-zA-Z0-9_]*
qstring = \" ~  \"

sep = "%%%"

// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)

comment = ("((--" ~ "--))")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */
token1 = {date}"?"{hours_rep}

date = 2020\/01\/1[2-9] | 2020\/01\/2[0-9] | 2020\/01\/3[0-1] | 2020\/02\/0[1-9] | 2020\/02\/[1-2][0-9] 
     | 2020\/0[3-7]\/0[1-9] | 2020\/0[3-6]\/[1-2][0-9] | 2020\/0[3-6]\/3[0-1] | 2020\/07\/1[0-3]

hour = [0-1][0-9]:[0-5][0-9] | 2[0-3]:[0-5][0-9]

hours_rep = {hour}{separ}{hour}{separ}{hour} | {hour}{separ}{hour}{separ}{hour} ({separ}{hour}{separ}{hour})*

separ = ("*"|"$")

/* TOKEN 2 */
token2 = "!"({number}|{strings})

number = -1[0246] | -[2468] | 0 | [2468] | [1-9][02468] | 1[0-2][02468] | 13[02468]

string = ("xx"|"yy"|"aa"|"bb")

strings = {string}{2} | {string}{7} | {string}{23}


%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

//"."         {return sym(sym.DOT);}
//","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
//":"         {return sym(sym.COL);}
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
"["         {return sym(sym.SO);}
"]"         {return sym(sym.SC);}
//"{"         {return sym(sym.BO);}
//"}"         {return sym(sym.BC);}
"="         {return sym(sym.EQ);}
"=="        {return sym(sym.EQEQ);}
//"!="        {return sym(sym.NEQ);}
"&"         {return sym(sym.AND);}
"|"         {return sym(sym.OR);}
"!"         {return sym(sym.NOT);}
"!!"        {return sym(sym.NOTNOT);}
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

"IF"          {return sym(sym.IF);}
"ELSE"        {return sym(sym.ELSE);}
"TRUE"        {return sym(sym.TRUE);}
"FALSE"       {return sym(sym.FALSE);}

{sep}     {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
{id}      {return sym(sym.ID, new String(yytext()));}
// {uint}    {return sym(sym.UINT,new Integer(yytext()));}
// {real}    {return sym(sym.REAL, new Double(yytext()));}
// {decimal} {return sym(sym.DECIMAL, new Double(yytext()));}

{comment} {;}

// {ws}|{nl}|" "   	{;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}