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
// decimal = ((0\.[0-9]{2}) | [1-9][0-9]*\.[0-9]{2} | \.[0-9]{2})
hexnum = [0-9a-fA-F]{4}|[0-9a-fA-F]{7}

id = [a-zA-Z_][a-zA-Z0-9_]*
// qstring = \" ~  \"

sep = "####"

// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
comment = ("[[-" ~ "-]]")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */
token1 = {hexnum}{separator}{hexnum}{separator}{hexnum} | ({hexnum}{separator}){8}{hexnum} |  ({hexnum}{separator}){26}{hexnum}

separator = ("*"|"$"|"%")

/* TOKEN 2 */
token2 = "?"({number}|{word})({opt_word})?

number = -3[1357] | -[1-2][13579] | -[13579] | [13579] | [1-9][13579] | [1-9][0-9][13579] | 1[0-9][0-9][13579] | 2[0-3][0-9][13579]
       | 24[0-1][13579] | 242[135]

word = [A-Z]{4} | [A-Z]{4} ([A-Z]{2})*

opt_word = ({opt_1} | {opt_2} | {opt_1}{opt_3} | {opt_2}{opt_4} | {opt_3} | {opt_4} ) 

opt_1 = ("+-")*

opt_2 = ("-+")*

opt_3 = "+"

opt_4 = "-"

/* TOKEN 3 */
token3 = "$"{date}(":")?{hour}

date = "Jan."\/09\/2020 | "Jan."\/[1-2][0-9]\/2020 | "Jan."\/3[0-1]\/2020 | "Feb."\/0[1-9]\/2020 | "Feb."\/[1-2][0-9]\/2020 
     | "Mar."\/0[1-9]\/2020 | "Mar."\/[1-2][0-9]\/2020 | "Mar."\/3[0-1]\/2020 | "Apr."\/0[1-9]\/2020 | "Apr."\/1[0-9]\/2020 | "Apr."\/2[0-3]\/2020

hour = 08:1[0-9] | 08:[2-5][0-9] | 09:[0-5][0-9] | 1[0-7]:[0-5][0-9] | 18:[0-2][0-9] | 18:3[0-2]

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
"["         {return sym(sym.SO);}
"]"         {return sym(sym.SC);}
"{"         {return sym(sym.BO);}
"}"         {return sym(sym.BC);}
"="         {return sym(sym.EQ);}
//"=="        {return sym(sym.EQEQ);}
//"!="        {return sym(sym.NEQ);}
//"&&"        {return sym(sym.AND);}
//"||"        {return sym(sym.OR);}
//"!"         {return sym(sym.NOT);}
//"|"         {return sym(sym.PIPE);}
"+"         {return sym(sym.PLUS);}
//"-"         {return sym(sym.MINUS);}
"*"         {return sym(sym.STAR);}
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

"INIT"       {return sym(sym.INIT);}
"WEIGHT"     {return sym(sym.WEIGHT);}
"g"          {return sym(sym.GRAMS);}
"kg"         {return sym(sym.KILOGRAMS);}
"VOLUME"     {return sym(sym.VOLUME);}
"l"          {return sym(sym.LITERS);}
"hl"         {return sym(sym.HECTOLITERS);}
"FZ"         {return sym(sym.FZ);}
"MIN"        {return sym(sym.MIN);}
"MAX"        {return sym(sym.MAX);}
"OBJECT"     {return sym(sym.OBJECT);}
"ATTRIBUTES" {return sym(sym.ATTRIBUTES);}
"MOD"        {return sym(sym.MOD);}
"ADD"        {return sym(sym.ADD);}
"SUB"        {return sym(sym.SUB);}
"IF"         {return sym(sym.IF);}

{sep}        {return sym(sym.SEP);}
// {qstring} {return sym(sym.QSTRING,new String(yytext()));}
{id}      {return sym(sym.ID, new String(yytext()));}
{uint}    {return sym(sym.UINT,new Integer(yytext()));}
// {real}    {return sym(sym.REAL, new Double(yytext()));}
// {decimal} {return sym(sym.DECIMAL, new Double(yytext()));}

{comment} {;}

// {ws}|{nl}|" "   	{;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}