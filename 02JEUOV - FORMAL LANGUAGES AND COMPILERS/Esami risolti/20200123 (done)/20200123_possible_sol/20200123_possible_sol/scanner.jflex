import java_cup.runtime.*;

%%

%class scanner
%unicode
%cup
%line
%column


%{
	public Boolean debug = false;
  private Symbol symbol(int type,String s) {
	if(debug) System.out.println(s);
    return new Symbol(type, yyline, yycolumn);
  }
  private Symbol symbol(int type,String s, Object value) {
	if(debug) System.out.println(s);
    return new Symbol(type, yyline, yycolumn, value);

  }
%}

nl = \r|\n|\r\n
ws = [ \t]
separator = "####"

hex = [0-9a-fA-F]{4} | [0-9a-fA-F]{7}
sep1 = ( "*" | "$" | "%" )
token1 = ({hex}{sep1}){2}{hex} | ({hex}{sep1}){8}{hex} | ({hex}{sep1}){26}{hex}

num2 = ( "-"3[1357] | "-"[12][13579] | "-"[13579] | [13579] | [0-9][13579] | [0-9][0-9][13579] | 1[0-9][0-9][13579] | 2[0-3][0-9][13579] | 24[01][13579] | 242[135] )
word2 = [A-Z]{4}( ([A-Z]{2})* )
word22 = ("+-")*("+")? | ("-+")*("-")? | "+" | "-"
token2 = "?"( {num2} | {word2} )({word22}?)

hh_b = 08":"10 | 08":"0[0-9]
hh_m =  0[0-7]":"[05][0-9] | 1[0-7]":"[05][0-9]
hh_e = 18":"[0-2][0-9] | 18":"3[0-2]
hh = {hh_b} | {hh_m} | {hh_e}
dd_b = "Jan./"(09 | [12][0-9] | 3[01])"/"2020
dd_m = "Feb./"(0[1-9] | [12][0-9])"/"2020 |  "Mar./"(0[1-9] | [12][0-9] | 3[01])"/"2020
dd_e = "Apr./"(0[1-9] | 1[0-9] | 2[0-3])"/"2020
dd= {dd_b} | {dd_m} | {dd_e}
token3 = "$"{dd}( ":"{hh} )?
id = [A-Za-z_][A-Za-z0-9_]*
integer = ([1-9][0-9]*|0)

%%

"="       {return symbol(sym.EQ,"EQ");}
"+"       {return symbol(sym.PLUS,"PLUS");}
"*"       {return symbol(sym.STAR,"STAR");}

"("       {return symbol(sym.RO,"RO");}
")"       {return symbol(sym.RC,"RC");}
"["       {return symbol(sym.SO,"SO");}
"]"       {return symbol(sym.SC,"SC");}
"{"       {return symbol(sym.BO,"BO");}
"}"       {return symbol(sym.BC,"BC");}

";"       {return symbol(sym.S,"S");}
","       {return symbol(sym.CM,"CM");}
"."       {return symbol(sym.DOT,"DOT");}

"INIT"    {return symbol(sym.INIT,"INIT");}
"WEIGHT"    {return symbol(sym.WEIGHT,"WEIGHT");}
"VOLUME"    {return symbol(sym.VOLUME,"VOLUME");}
"g"    {return symbol(sym.G,"G");}
"kg"    {return symbol(sym.KG,"KG");}
"l"    {return symbol(sym.L,"L");}
"hl"    {return symbol(sym.HL,"HL");}
"FZ"    {return symbol(sym.FZ,"FZ");}
"MAX"    {return symbol(sym.MAX,"MAX");}
"MIN"    {return symbol(sym.MIN,"MIN");}
"OBJECT"    {return symbol(sym.OBJECT,"OBJECT");}
"ATTRIBUTES"    {return symbol(sym.ATTRIBUTES,"ATTRIBUTES");}
"IF"    {return symbol(sym.IF,"IF");}
"MOD"    {return symbol(sym.MOD,"MOD");}
"ADD"    {return symbol(sym.ADD,"ADD");}
"SUB"    {return symbol(sym.SUB,"SUB");}


{separator}    {return symbol(sym.SEP,"SEP");}
{token1}       {return symbol(sym.TOK1,"TOK1");}
{token2}       {return symbol(sym.TOK2,"TOK2");}
{token3}       {return symbol(sym.TOK3,"TOK3");}

{integer} {return symbol(sym.INT,"INT", new Integer(yytext()));}
{id}      {return symbol(sym.ID,"ID", new String(yytext()));}

"[[-" ~ "-]]"     {;}

{ws}|{nl}       {;}

.         {System.out.println("Errore: " + (yyline+1) + " " + (yycolumn+1) + ": " + yytext());}
