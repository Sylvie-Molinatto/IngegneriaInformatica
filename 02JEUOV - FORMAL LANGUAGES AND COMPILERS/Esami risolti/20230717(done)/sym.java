
//----------------------------------------------------
// The following code was generated by CUP v0.11b beta 20140226
//----------------------------------------------------

/** CUP generated class containing symbol constants. */
public class sym {
  /* terminals */
  public static final int TK1 = 2;
  public static final int PERCENT = 10;
  public static final int QSTRING = 11;
  public static final int CM = 9;
  public static final int S = 6;
  public static final int DASH = 7;
  public static final int EOF = 0;
  public static final int EURO = 8;
  public static final int SEP = 5;
  public static final int REAL = 13;
  public static final int error = 1;
  public static final int UINT = 12;
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
  "EURO",
  "CM",
  "PERCENT",
  "QSTRING",
  "UINT",
  "REAL"
  };
public String[] TT;
	public sym(){
		TT = new String[100];
		TT[2]=new String("TK1");
		TT[10]=new String("PERCENT");
		TT[11]=new String("QSTRING");
		TT[9]=new String("CM");
		TT[6]=new String("S");
		TT[7]=new String("DASH");
		TT[0]=new String("EOF");
		TT[8]=new String("EURO");
		TT[5]=new String("SEP");
		TT[13]=new String("REAL");
		TT[1]=new String("error");
		TT[12]=new String("UINT");
		TT[4]=new String("TK3");
		TT[3]=new String("TK2");
	}
public String getTT(int i){return TT[i];}
}
