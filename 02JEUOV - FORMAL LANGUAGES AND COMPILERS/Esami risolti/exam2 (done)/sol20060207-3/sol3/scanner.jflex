///////////////////////////////////
/// Scanner exam 07-02-2006 //////
///////////////////////////////////

import java_cup.runtime.*;

%%

%cup
%line
%column

number		=	[0-9]+
date		=	((0[1-9])|([1-2][0-9])|(3(0|1)))"/"((0[1-9])|(1(0|1|2)))"/"(2[0-9][0-9][0-9])
hour		=	(((0|1)[0-9])|(2[0-3]))":"([0-5][0-9])
song    	=	[a-zA-Z][_a-zA-Z0-9]*".mp3"
ip_num		=	(2(([0-4][0-9])|(5[0-5])))|(1[0-9][0-9])|([1-9][0-9])|([0-9])
ip		=	{ip_num}"."{ip_num}"."{ip_num}"."{ip_num}


%%

"mp3_list"    	{return new Symbol(sym.START, yyline, yycolumn); }
"Kb/s"    	{return new Symbol(sym.KBS, yyline, yycolumn); }
"server"    	{return new Symbol(sym.SERVER, yyline, yycolumn); }
"time"    	{return new Symbol(sym.TIME, yyline, yycolumn); }
"data"    	{return new Symbol(sym.DATA, yyline, yycolumn); }
";"		{return new Symbol(sym.S, yyline, yycolumn); }
","		{return new Symbol(sym.CM, yyline, yycolumn); }
":"		{return new Symbol(sym.C, yyline, yycolumn); }

{ip}		{return new Symbol(sym.IP, yyline, yycolumn, new String(yytext())); }
{number}	{return new Symbol(sym.NUMBER, yyline, yycolumn, new Integer(yytext())); }
{song}   	{return new Symbol(sym.SONG, yyline, yycolumn, new String(yytext())); }
{date}		{return new Symbol(sym.DATE, yyline, yycolumn); }
{hour}		{return new Symbol(sym.HOUR, yyline, yycolumn); }

[ \t] 	        {;}
\r | \n | \r\n  {;}
