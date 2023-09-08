
//----------------------------------------------------
// The following code was generated by CUP v0.11b beta 20140226
//----------------------------------------------------

/** CUP generated class containing symbol constants. */
public class sym {
  /* terminals */
  public static final int LITERS = 10;
  public static final int PLUS_WD = 11;
  public static final int MOD = 16;
  public static final int CM = 3;
  public static final int MAX_WD = 13;
  public static final int S = 2;
  public static final int RO = 14;
  public static final int FUEL = 9;
  public static final int DO = 18;
  public static final int RC = 15;
  public static final int BATTERY = 6;
  public static final int KWH = 8;
  public static final int EOF = 0;
  public static final int SEP = 4;
  public static final int error = 1;
  public static final int UNITSKM = 21;
  public static final int USE = 17;
  public static final int START = 5;
  public static final int DASH = 7;
  public static final int STAR_WD = 12;
  public static final int REAL = 24;
  public static final int KM = 20;
  public static final int DONE = 19;
  public static final int TK2 = 23;
  public static final int TK1 = 22;
  public static final String[] terminalNames = new String[] {
  "EOF",
  "error",
  "S",
  "CM",
  "SEP",
  "START",
  "BATTERY",
  "DASH",
  "KWH",
  "FUEL",
  "LITERS",
  "PLUS_WD",
  "STAR_WD",
  "MAX_WD",
  "RO",
  "RC",
  "MOD",
  "USE",
  "DO",
  "DONE",
  "KM",
  "UNITSKM",
  "TK1",
  "TK2",
  "REAL"
  };
public String[] TT;
	public sym(){
		TT = new String[100];
		TT[10]=new String("LITERS");
		TT[11]=new String("PLUS_WD");
		TT[16]=new String("MOD");
		TT[3]=new String("CM");
		TT[13]=new String("MAX_WD");
		TT[2]=new String("S");
		TT[14]=new String("RO");
		TT[9]=new String("FUEL");
		TT[18]=new String("DO");
		TT[15]=new String("RC");
		TT[6]=new String("BATTERY");
		TT[8]=new String("KWH");
		TT[0]=new String("EOF");
		TT[4]=new String("SEP");
		TT[1]=new String("error");
		TT[21]=new String("UNITSKM");
		TT[17]=new String("USE");
		TT[5]=new String("START");
		TT[7]=new String("DASH");
		TT[12]=new String("STAR_WD");
		TT[24]=new String("REAL");
		TT[20]=new String("KM");
		TT[19]=new String("DONE");
		TT[23]=new String("TK2");
		TT[22]=new String("TK1");
	}
public String getTT(int i){return TT[i];}
}
