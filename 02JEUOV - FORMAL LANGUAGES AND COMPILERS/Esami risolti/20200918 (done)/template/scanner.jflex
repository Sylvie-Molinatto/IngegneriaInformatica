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

sep = "###"

// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)

comment = ("{-" ~ "-}")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */
token1 = "*"{word}{octal}({word_reps})?

word = [a-z]{4} | [a-z]{4} ([a-z]{2})*

octal = -[1-3][0-7] | -[1-7] | 0 | [1-7] | [1-7][0-7] | 1[0-1][0-7] | 12[0-3]

word_2 = ("xx"|"yy"|"zz")

word_reps = {word_2}{4} | {word_2}{4}{word_2}*

/* TOKEN 2 */
token2 = {email}{separator}{email} | {email}{separator}{email} ({separator}{email}){8} | {email}{separator}{email}({separator}{email}){29}

separator = (":"|"/")

email = ([a-zA-Z0-9._]+@[a-zA-Z0-9]+\.("it"|"org"|"net"))

/* TOKEN 3 */
token3 = "token3"

%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
{token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

//"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
//":"         {return sym(sym.COL);}
"("         {return sym(sym.RO);}
")"         {return sym(sym.RC);}
//"["         {return sym(sym.SO);}
//"]"         {return sym(sym.SC);}
//"{"         {return sym(sym.BO);}
//"}"         {return sym(sym.BC);}
"="         {return sym(sym.EQ);}
//"=="        {return sym(sym.EQEQ);}
//"!="        {return sym(sym.NEQ);}
//"&&"        {return sym(sym.AND);}
//"||"        {return sym(sym.OR);}
//"!"         {return sym(sym.NOT);}
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

"EQUAL"       {return sym(sym.EQUAL);}
"TO"          {return sym(sym.TO);}
"DO"          {return sym(sym.DO);}
"DONE"        {return sym(sym.DONE);}
"write"       {return sym(sym.WRITE);}
"and"         {return sym(sym.AND);}
"or"          {return sym(sym.OR);}
"not"         {return sym(sym.NOT);}
"true"        {return sym(sym.TRUE);}
"false"       {return sym(sym.FALSE);}
"AND"         {return sym(sym.ANDFUNCTION);}
 
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