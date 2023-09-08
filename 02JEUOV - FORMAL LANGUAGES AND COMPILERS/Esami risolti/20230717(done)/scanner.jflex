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
real = ("+" | "-")? ((0\.[0-9]*) | [1-9][0-9]*\.[0-9]* | \.[0-9]+ | [1-9][0-9]*\. | 0\.)
// decimal = ((0\.[0-9]{2}) | [1-9][0-9]*\.[0-9]{2} | \.[0-9]{2})
// hexnum = [0-9a-fA-F]

// id = [a-zA-Z_][a-zA-Z0-9_]*
qstring = \" ~  \"

sep = "***"

cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
comment = ("{{" ~ "}}")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */
token1 = {hexnum}"*"{char_rep}"-"({final_char_1}|{final_word})?
hexnum = 27[A-Fa-f] | 2[8-9A-Fa-f][0-9a-fA-F] | [3-9a-fA-F][0-9a-fA-F][0-9a-fA-F] 
       | 1[0-1][0-9a-fA-F][0-9a-fA-F] | 12[0-9aA][0-9a-fA-F]| 12[bB][0-3]

char_rep = {char} {5} | {char}{5} ({char}{2})*

char = [a-zA-Z]

final_char_1 = "****" | "****"("**")*

final_word = Y{x_odd}Y

x_odd = "X" | "X"("XX")*

/* TOKEN 2 */
token2 = {number}"."{number}"."{number}"."{number}"-"{date}

number = 0 | [1-9] | [1-9][0-9] | 1[0-9][0-9] | 2[0-4][0-9] | 25[0-5] 

date = 0[5-9]\/10\/2023 | [1-2][0-9]\/10\/2023 | 3[0-1]\/10\/2023 | 0[1-9]\/1[1-2]\/2023 
     | [1-2][0-9]\/1[1-2]\/2023 | 30\/1[1-2]\/2023 | 31\/12\/2023 | 0[1-9]\/0[1-2]\/2024
	 | [1-2][0-9]\/0[1-2]\/2024 | 3[0-1]\/01\/2024 | 0[1-3]\/03\/2024

/* TOKEN 3 */
token3 = {number_reps}

number_2 = [0-9]{4} | [0-9]{6}

number_reps = {number_2}{separator}{number_2}{separator}{number_2} |  {number_2}{separator}{number_2}{separator}{number_2}{separator}{number_2}{separator}{number_2}

separator = ("-"|"+")



%%

{token1}     {return sym(sym.TK1);}   
{token2}     {return sym(sym.TK2);}  
{token3}     {return sym(sym.TK3);}  

// ALL INTRODUCED SYMBOLS NEED TO BE DECLARED AS TERMINALS INSIDE OF CUP FILE OTHERWISE YOU HAVE AN ERROR WHEN COMPILING WITH JAVAC

//"."         {return sym(sym.DOT);}
","         {return sym(sym.CM);}
";"         {return sym(sym.S);}
//":"         {return sym(sym.COL);}
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
"-"         {return sym(sym.DASH);}
//"_"         {return sym(sym.UNDERSCORE);}
//"$"         {return sym(sym.DOLLAR);}
//"€"         {return sym(sym.EURO);}
"%"           {return sym(sym.PERCENT);}

"euro"        {return sym(sym.EURO);}

{sep}     {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
// {id}      {return sym(sym.ID, new String(yytext()));}
{uint}    {return sym(sym.UINT,new Integer(yytext()));}
{real}    {return sym(sym.REAL, new Double(yytext()));}
// {decimal} {return sym(sym.DECIMAL, new Double(yytext()));}

{comment} {;}
{cpp_comment} {;}

// {ws}|{nl}|" "   	{;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}