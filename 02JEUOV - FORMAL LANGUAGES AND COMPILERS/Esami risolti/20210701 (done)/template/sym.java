
//----------------------------------------------------
// The following code was generated by CUP v0.11b beta 20140226
//----------------------------------------------------

/** CUP generated class containing symbol constants. */
public class sym {
  /* terminals */
  public static final int TK1 = 2;
  public static final int BC = 8;
  public static final int EURO_KG = 10;
  public static final int QSTRING = 13;
  public static final int CM = 9;
  public static final int S = 4;
  public static final int EOF = 0;
  public static final int EURO = 11;
  public static final int SEP = 6;
  public static final int BO = 7;
  public static final int REAL = 15;
  public static final int error = 1;
  public static final int COL = 5;
  public static final int KG = 12;
  public static final int UINT = 14;
  public static final int TK2 = 3;
  public static final String[] terminalNames = new String[] {
  "EOF",
  "error",
  "TK1",
  "TK2",
  "S",
  "COL",
  "SEP",
  "BO",
  "BC",
  "CM",
  "EURO_KG",
  "EURO",
  "KG",
  "QSTRING",
  "UINT",
  "REAL"
  };
public String[] TT;
	public sym(){
		TT = new String[100];
		TT[2]=new String("TK1");
		TT[8]=new String("BC");
		TT[10]=new String("EURO_KG");
		TT[13]=new String("QSTRING");
		TT[9]=new String("CM");
		TT[4]=new String("S");
		TT[0]=new String("EOF");
		TT[11]=new String("EURO");
		TT[6]=new String("SEP");
		TT[7]=new String("BO");
		TT[15]=new String("REAL");
		TT[1]=new String("error");
		TT[5]=new String("COL");
		TT[12]=new String("KG");
		TT[14]=new String("UINT");
		TT[3]=new String("TK2");
	}
public String getTT(int i){return TT[i];}
}
