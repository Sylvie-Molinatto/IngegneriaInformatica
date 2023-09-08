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
file_name = [a-zA-Z][a-zA-Z0-9_]*.mp3
date = ([0-2][0-9] | 3[0-1])\/(0[1-9]|1[0-2])\/2[0-9][0-9][0-9]
ip_addr = {ip_num}"."{ip_num}"."{ip_num}"."{ip_num}
ip_num = [0-9] | [1-9][0-9] | 1[0-9][0-9] | 2[0-4][0-9] | 25[0-5]
time = ([0-1][0-9] | 2[0-3]):[0-5][0-9]

// real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// hexnum = [0-9a-fA-F]

// id = [a-zA-Z_][a-zA-Z0-9_]*
// qstring = \" ~  \"

// sep = "===="

// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */

/* TOKEN 2 */

/* TOKEN 3 */


%%

// {token1}     {return sym(sym.TK1);}   
// {token2}     {return sym(sym.TK2);}  
// {token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

//"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
":"         {return sym(sym.COL);}
//"("         {return sym(sym.RO);}
//")"         {return sym(sym.RC);}
//"["         {return sym(sym.SO);}
//"]"         {return sym(sym.SC);}
//"{"         {return sym(sym.BO);}
//"}"         {return sym(sym.BC);}
//"="         {return sym(sym.EQ);}
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

"mp3_list:"   {return sym(sym.MP3LIST);}
"server:"      {return sym(sym.SERVER);}
"Kb/s"        {return sym(sym.KBITSEC);}
"time:"       {return sym(sym.TIME_WD);}
"data:"       {return sym(sym.DATA_WD);}

// {sep}     {return sym(sym.SEP);}
// {qstring} {return sym(sym.QSTRING,new String(yytext()));}
// {id}      {return sym(sym.ID, new String(yytext()));}
{uint}       {return sym(sym.UINT,new Integer(yytext()));}
{file_name}  {return sym(sym.FILENAME, new String(yytext()));}
{date}       {return sym(sym.DATE, new String(yytext()));}
{time}       {return sym(sym.TIME, new String(yytext()));}
{ip_addr}    {return sym(sym.IP, new String(yytext()));}
// {real}    {return sym(sym.REAL, new Double(yytext()));}

//{comment} {;}

// {ws}|{nl}|" "   	{;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}