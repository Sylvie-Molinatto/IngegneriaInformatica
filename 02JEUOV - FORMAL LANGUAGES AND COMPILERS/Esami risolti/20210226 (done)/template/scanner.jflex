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
real = ((0\.[0-9]{2}) | [1-9][0-9]*\.[0-9]{2} | \.[0-9]{2} )
// hexnum = [0-9a-fA-F]

// id = [a-zA-Z_][a-zA-Z0-9_]*
qstring = \" ~  \"

sep = "$$$"
comment = ("<<-" ~ "->>")

// cpp_comment = ("//" .*)
// cpp_comment = "/-" ~ "-/"
// comment = \(\+\+ (.*) \+\+\)
// comment = ("(+-" ~ "-+)")

// nl = \r | \n | \r\n
// ws = [ \t]


/* TOKEN 1 */
token1 = A_{number}{number_rep} | A_{number}{number_rep}{11} | A_{number}{number_rep}{26}"#"{number}

number_rep = "#"{number}"#"{number} 

number = -2[0-3] | -1[0-9] | -[0-9] | [0-9] | [1-9][0-9] | 1[0-9][0-9] | 2[0-2][0-9] | 23[0-6]

/* TOKEN 2 */
token2 = B_{date}

date   = 2020" November "0[6-9] | 2020" November "[1-2][0-9] | 2020" November "30  
        | 2020" December "[0-2][0-9] | 2020" December "3[0-1] | 2021" January "[0-2][0-9]
		| 2021" January "3[0-1] | 2021" February "[0-1][0-9] |  2021" February "2[0-8] 
		| 2021" March "[0-1][0-9] |  2021" March "2[0-8]

/* TOKEN 3 */
token3 = C_{word_reps}

word_reps = {word}{6}({word}{2})*

word = ("++"|"--"|"+-"|"-+")

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
"::"         {return sym(sym.DOUBLECOL);}
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
"%"         {return sym(sym.PERCENT);}
"-"         {return sym(sym.DASH);}
"euro"      {return sym(sym.EURO_WD);}
{sep} {return sym(sym.SEP);}
{qstring} {return sym(sym.QSTRING,new String(yytext()));}
{uint} {return sym(sym.UINT,new Integer(yytext()));}
{real} {return sym(sym.REAL, new Double(yytext()));}

{comment} {;}
// {ws}|{nl}|" "   	{;}
\r | \n | \r\n| " " | \t {;}

.           {System.out.println("Scanner error: " + yytext());}