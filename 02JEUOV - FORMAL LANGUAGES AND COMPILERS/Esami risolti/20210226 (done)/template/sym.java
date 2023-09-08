
//----------------------------------------------------
// The following code was generated by CUP v0.11b beta 20140226
//----------------------------------------------------

/** CUP generated class containing symbol constants. */
public class sym {
  /* terminals */
  public static final int TK1 = 2;
  public static final int EURO_WD = 9;
  public static final int PERCENT = 11;
  public static final int QSTRING = 12;
  public static final int CM = 8;
  public static final int S = 6;
  public static final int DASH = 7;
  public static final int EOF = 0;
  public static final int SEP = 5;
  public static final int DOUBLECOL = 10;
  public static final int REAL = 14;
  public static final int error = 1;
  public static final int UINT = 13;
  public static final int TK3 = 4;
  public static final int TK2 = 3;
  public static final String[] terminalNames = new String[] {
  "EOF",
  "error",
  "TK1",
  "TK2",
  "TK3",
  "SEP",
  "S",
  "DASH",
  "CM",
  "EURO_WD",
  "DOUBLECOL",
  "PERCENT",
  "QSTRING",
  "UINT",
  "REAL"
  };
public String[] TT;
	public sym(){
		TT = new String[100];
		TT[2]=new String("TK1");
		TT[9]=new String("EURO_WD");
		TT[11]=new String("PERCENT");
		TT[12]=new String("QSTRING");
		TT[8]=new String("CM");
		TT[6]=new String("S");
		TT[7]=new String("DASH");
		TT[0]=new String("EOF");
		TT[5]=new String("SEP");
		TT[10]=new String("DOUBLECOL");
		TT[14]=new String("REAL");
		TT[1]=new String("error");
		TT[13]=new String("UINT");
		TT[4]=new String("TK3");
		TT[3]=new String("TK2");
	}
public String getTT(int i){return TT[i];}
}
