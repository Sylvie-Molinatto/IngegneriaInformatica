// DO NOT EDIT
// Generated by JFlex 1.8.2 http://jflex.de/
// source: scanner.jflex

import java_cup.runtime.*;


// See https://github.com/jflex-de/jflex/issues/222
@SuppressWarnings("FallThrough")
class Yylex implements java_cup.runtime.Scanner {

  /** This character denotes the end of file. */
  public static final int YYEOF = -1;

  /** Initial size of the lookahead buffer. */
  private static final int ZZ_BUFFERSIZE = 16384;

  // Lexical states.
  public static final int YYINITIAL = 0;

  /**
   * ZZ_LEXSTATE[l] is the state in the DFA for the lexical state l
   * ZZ_LEXSTATE[l+1] is the state in the DFA for the lexical state l
   *                  at the beginning of a line
   * l is of the form l = 2*k, k a non negative integer
   */
  private static final int ZZ_LEXSTATE[] = {
     0, 0
  };

  /**
   * Top-level table for translating characters to character classes
   */
  private static final int [] ZZ_CMAP_TOP = zzUnpackcmap_top();

  private static final String ZZ_CMAP_TOP_PACKED_0 =
    "\1\0\37\u0100\1\u0200\267\u0100\10\u0300\u1020\u0100";

  private static int [] zzUnpackcmap_top() {
    int [] result = new int[4352];
    int offset = 0;
    offset = zzUnpackcmap_top(ZZ_CMAP_TOP_PACKED_0, offset, result);
    return result;
  }

  private static int zzUnpackcmap_top(String packed, int offset, int [] result) {
    int i = 0;       /* index in packed string  */
    int j = offset;  /* index in unpacked array */
    int l = packed.length();
    while (i < l) {
      int count = packed.charAt(i++);
      int value = packed.charAt(i++);
      do result[j++] = value; while (--count > 0);
    }
    return j;
  }


  /**
   * Second-level tables for translating characters to character classes
   */
  private static final int [] ZZ_CMAP_BLOCKS = zzUnpackcmap_blocks();

  private static final String ZZ_CMAP_BLOCKS_PACKED_0 =
    "\11\0\1\1\1\2\2\3\1\4\22\0\1\5\11\0"+
    "\1\6\1\7\1\10\1\11\1\0\1\12\1\13\1\14"+
    "\1\15\1\16\2\17\1\20\1\21\1\22\1\23\1\24"+
    "\1\25\1\0\1\26\1\27\2\0\1\30\1\31\1\32"+
    "\1\33\1\34\1\35\1\36\1\37\1\40\1\41\1\42"+
    "\1\43\1\44\1\45\1\46\1\47\2\0\1\50\1\51"+
    "\1\52\5\0\1\53\1\0\1\54\1\0\1\55\1\0"+
    "\1\56\3\57\1\60\1\61\24\62\1\0\1\6\10\0"+
    "\1\3\u01a2\0\2\3\326\0\u0100\3";

  private static int [] zzUnpackcmap_blocks() {
    int [] result = new int[1024];
    int offset = 0;
    offset = zzUnpackcmap_blocks(ZZ_CMAP_BLOCKS_PACKED_0, offset, result);
    return result;
  }

  private static int zzUnpackcmap_blocks(String packed, int offset, int [] result) {
    int i = 0;       /* index in packed string  */
    int j = offset;  /* index in unpacked array */
    int l = packed.length();
    while (i < l) {
      int count = packed.charAt(i++);
      int value = packed.charAt(i++);
      do result[j++] = value; while (--count > 0);
    }
    return j;
  }

  /**
   * Translates DFA states to action switch labels.
   */
  private static final int [] ZZ_ACTION = zzUnpackAction();

  private static final String ZZ_ACTION_PACKED_0 =
    "\1\0\1\1\2\2\1\1\1\3\2\4\1\5\1\6"+
    "\1\7\11\1\1\10\1\11\35\0\1\12\1\0\1\13"+
    "\2\0\1\14\1\15\1\16\1\0\1\17\24\0\1\20"+
    "\1\0\1\21\15\0\1\22\5\0\1\23\26\0\1\24"+
    "\12\0\1\23\22\0\1\24\5\0\3\25";

  private static int [] zzUnpackAction() {
    int [] result = new int[165];
    int offset = 0;
    offset = zzUnpackAction(ZZ_ACTION_PACKED_0, offset, result);
    return result;
  }

  private static int zzUnpackAction(String packed, int offset, int [] result) {
    int i = 0;       /* index in packed string  */
    int j = offset;  /* index in unpacked array */
    int l = packed.length();
    while (i < l) {
      int count = packed.charAt(i++);
      int value = packed.charAt(i++);
      do result[j++] = value; while (--count > 0);
    }
    return j;
  }


  /**
   * Translates a state to a row index in the transition table
   */
  private static final int [] ZZ_ROWMAP = zzUnpackRowMap();

  private static final String ZZ_ROWMAP_PACKED_0 =
    "\0\0\0\63\0\63\0\146\0\231\0\63\0\63\0\314"+
    "\0\63\0\377\0\63\0\u0132\0\u0165\0\u0198\0\u01cb\0\u01fe"+
    "\0\u0231\0\u0264\0\u0297\0\u02ca\0\63\0\63\0\u02fd\0\u0330"+
    "\0\u0363\0\u0396\0\u03c9\0\u03fc\0\u042f\0\u0462\0\u0495\0\u04c8"+
    "\0\u04fb\0\u052e\0\u0561\0\u0594\0\u05c7\0\u05fa\0\u062d\0\u0660"+
    "\0\u0693\0\u06c6\0\u06f9\0\u072c\0\u075f\0\u0792\0\u07c5\0\u07f8"+
    "\0\u082b\0\u085e\0\u0891\0\63\0\u08c4\0\63\0\u08f7\0\u092a"+
    "\0\63\0\63\0\63\0\u095d\0\63\0\u0990\0\u09c3\0\u09f6"+
    "\0\u0a29\0\u0a5c\0\u0a8f\0\u0ac2\0\u0af5\0\u0b28\0\u0b5b\0\u0b8e"+
    "\0\u0bc1\0\u0bf4\0\u0c27\0\u0c5a\0\u0c8d\0\u0cc0\0\u0cf3\0\u0d26"+
    "\0\u0d59\0\63\0\u0d8c\0\63\0\u0dbf\0\u0df2\0\u0e25\0\u0e58"+
    "\0\u0e8b\0\u0ebe\0\u0ef1\0\u0f24\0\u0f57\0\u0f8a\0\u0fbd\0\u0ff0"+
    "\0\u1023\0\63\0\u1056\0\u1089\0\u10bc\0\u10ef\0\u1122\0\u1155"+
    "\0\u1188\0\u11bb\0\u11ee\0\u1221\0\u1254\0\u1287\0\u12ba\0\u12ed"+
    "\0\u1320\0\u1353\0\u1386\0\u13b9\0\u13ec\0\u141f\0\u1452\0\u1485"+
    "\0\u14b8\0\u14eb\0\u151e\0\u1551\0\u1584\0\u15b7\0\u15ea\0\u161d"+
    "\0\u1650\0\u1683\0\u16b6\0\u16e9\0\u171c\0\u174f\0\u1782\0\u17b5"+
    "\0\u17e8\0\u15b7\0\u181b\0\u184e\0\u1881\0\u18b4\0\u18e7\0\u191a"+
    "\0\u194d\0\u1980\0\u19b3\0\u19e6\0\u1a19\0\u1a4c\0\u1a7f\0\u1ab2"+
    "\0\u1ae5\0\u1b18\0\u1b4b\0\u1b7e\0\63\0\u1bb1\0\u1be4\0\u1c17"+
    "\0\u1c4a\0\u1c7d\0\u1cb0\0\u1ce3\0\u17e8";

  private static int [] zzUnpackRowMap() {
    int [] result = new int[165];
    int offset = 0;
    offset = zzUnpackRowMap(ZZ_ROWMAP_PACKED_0, offset, result);
    return result;
  }

  private static int zzUnpackRowMap(String packed, int offset, int [] result) {
    int i = 0;  /* index in packed string  */
    int j = offset;  /* index in unpacked array */
    int l = packed.length();
    while (i < l) {
      int high = packed.charAt(i++) << 16;
      result[j++] = high | packed.charAt(i++);
    }
    return j;
  }

  /**
   * The transition table of the DFA
   */
  private static final int [] ZZ_TRANS = zzUnpackTrans();

  private static final String ZZ_TRANS_PACKED_0 =
    "\1\2\2\3\1\0\1\4\1\3\1\2\1\5\1\6"+
    "\2\2\1\7\10\10\1\2\1\11\1\12\1\13\2\2"+
    "\1\14\1\15\3\2\1\16\1\17\1\20\1\21\1\2"+
    "\1\22\3\2\1\23\1\2\1\24\1\25\1\26\6\2"+
    "\65\0\1\3\71\0\1\27\64\0\11\10\65\0\1\30"+
    "\102\0\1\31\62\0\1\32\50\0\1\33\73\0\1\34"+
    "\7\0\1\35\62\0\1\36\62\0\1\37\57\0\1\40"+
    "\57\0\1\41\2\0\1\42\57\0\1\43\24\0\1\44"+
    "\77\0\1\45\101\0\1\46\62\0\1\47\55\0\1\50"+
    "\62\0\1\51\35\0\1\52\1\53\1\54\1\55\60\0"+
    "\2\56\1\57\5\60\4\0\1\61\5\62\20\0\1\61"+
    "\3\62\57\0\5\63\43\0\1\64\53\0\1\65\72\0"+
    "\1\66\51\0\1\67\27\0\11\44\1\70\51\44\26\0"+
    "\1\71\67\0\1\72\63\0\1\73\64\0\1\74\75\0"+
    "\1\75\25\0\2\76\2\77\4\100\52\0\11\100\52\0"+
    "\10\100\1\101\52\0\1\101\1\102\61\0\11\62\4\0"+
    "\6\62\20\0\4\62\14\0\11\62\4\0\1\62\5\103"+
    "\20\0\1\62\3\103\14\0\11\103\4\0\6\103\20\0"+
    "\4\103\14\0\11\103\4\0\4\103\1\104\1\105\20\0"+
    "\2\103\1\104\1\105\14\0\11\105\4\0\6\105\20\0"+
    "\4\105\57\0\5\106\34\0\1\107\56\0\1\110\32\0"+
    "\11\44\1\111\51\44\37\0\1\112\35\0\1\113\62\0"+
    "\1\114\62\0\1\115\62\0\1\116\62\0\1\117\55\0"+
    "\3\120\1\0\1\120\1\0\11\105\4\0\6\105\20\0"+
    "\4\105\6\0\3\120\1\0\1\120\1\0\4\105\51\0"+
    "\3\120\1\0\1\120\127\0\5\121\33\0\1\122\100\0"+
    "\1\123\11\0\7\44\1\3\1\44\1\111\51\44\51\0"+
    "\1\124\24\0\1\125\1\126\61\0\1\127\1\126\61\0"+
    "\1\130\1\126\61\0\1\131\1\126\61\0\1\132\1\133"+
    "\62\0\2\134\1\135\5\136\4\0\1\137\5\140\20\0"+
    "\1\137\3\140\57\0\5\141\34\0\1\142\42\0\3\143"+
    "\57\0\3\144\61\0\3\143\4\0\1\144\53\0\2\143"+
    "\5\0\1\144\53\0\1\143\6\0\1\144\53\0\1\143"+
    "\61\0\1\144\1\0\1\144\60\0\11\140\4\0\6\140"+
    "\20\0\4\140\14\0\11\140\4\0\1\140\5\145\20\0"+
    "\1\140\3\145\14\0\11\145\4\0\6\145\20\0\4\145"+
    "\14\0\11\145\4\0\4\145\1\146\1\147\20\0\2\145"+
    "\1\146\1\147\14\0\11\147\4\0\6\147\20\0\4\147"+
    "\57\0\5\150\12\0\1\151\62\0\1\152\55\0\3\153"+
    "\1\0\1\153\1\0\11\147\4\0\6\147\20\0\4\147"+
    "\6\0\3\153\1\0\1\153\1\0\4\147\51\0\3\153"+
    "\1\0\1\153\64\0\2\154\41\0\5\141\15\0\1\155"+
    "\62\0\1\156\61\0\2\157\1\160\5\161\4\0\1\162"+
    "\5\163\20\0\1\162\3\163\14\0\2\164\61\0\1\165"+
    "\62\0\1\166\62\0\11\163\4\0\6\163\20\0\4\163"+
    "\14\0\11\163\4\0\1\163\5\167\20\0\1\163\3\167"+
    "\14\0\11\167\4\0\6\167\20\0\4\167\14\0\11\167"+
    "\4\0\4\167\1\170\1\171\20\0\2\167\1\170\1\171"+
    "\14\0\11\171\4\0\6\171\20\0\4\171\14\0\2\172"+
    "\63\0\1\173\62\0\1\174\52\0\3\175\1\0\1\175"+
    "\1\0\11\171\4\0\6\171\20\0\4\171\6\0\3\175"+
    "\1\0\1\175\1\0\4\171\51\0\3\175\1\0\1\175"+
    "\64\0\2\176\63\0\1\177\61\0\1\177\62\0\2\200"+
    "\1\201\5\202\4\0\1\203\5\204\20\0\1\203\3\204"+
    "\14\0\2\205\72\0\1\206\51\0\11\204\4\0\6\204"+
    "\20\0\4\204\14\0\11\204\4\0\1\204\5\207\20\0"+
    "\1\204\3\207\14\0\11\207\4\0\6\207\20\0\4\207"+
    "\14\0\11\207\4\0\4\207\1\210\1\211\20\0\2\207"+
    "\1\210\1\211\14\0\11\211\4\0\6\211\20\0\4\211"+
    "\14\0\2\212\61\0\1\213\1\214\53\0\3\215\1\0"+
    "\1\215\1\0\11\211\4\0\6\211\20\0\4\211\6\0"+
    "\3\215\1\0\1\215\1\0\4\211\51\0\3\215\1\0"+
    "\1\215\73\0\2\216\52\0\6\216\1\217\55\0\2\220"+
    "\1\221\5\222\4\0\1\223\5\224\20\0\1\223\3\224"+
    "\25\0\1\225\62\0\1\226\51\0\11\224\4\0\6\224"+
    "\20\0\4\224\14\0\11\224\4\0\1\224\5\227\20\0"+
    "\1\224\3\227\14\0\11\227\4\0\6\227\20\0\4\227"+
    "\14\0\11\227\4\0\4\227\1\230\1\231\20\0\2\227"+
    "\1\230\1\231\14\0\11\231\4\0\6\231\20\0\4\231"+
    "\14\0\5\232\56\0\3\232\1\233\51\0\3\234\1\0"+
    "\1\234\1\0\11\231\4\0\6\231\20\0\4\231\6\0"+
    "\3\234\1\0\1\234\1\0\4\231\51\0\3\234\1\0"+
    "\1\234\64\0\11\235\52\0\5\235\57\0\2\236\1\237"+
    "\5\240\4\0\1\241\5\242\20\0\1\241\3\242\14\0"+
    "\11\242\4\0\6\242\20\0\4\242\14\0\11\242\4\0"+
    "\1\242\5\243\20\0\1\242\3\243\14\0\11\243\4\0"+
    "\6\243\20\0\4\243\14\0\11\243\4\0\4\243\1\244"+
    "\1\245\20\0\2\243\1\244\1\245\14\0\11\245\4\0"+
    "\6\245\20\0\4\245\6\0\3\215\1\0\1\215\1\0"+
    "\11\245\4\0\6\245\20\0\4\245\6\0\3\215\1\0"+
    "\1\215\1\0\4\245\44\0";

  private static int [] zzUnpackTrans() {
    int [] result = new int[7446];
    int offset = 0;
    offset = zzUnpackTrans(ZZ_TRANS_PACKED_0, offset, result);
    return result;
  }

  private static int zzUnpackTrans(String packed, int offset, int [] result) {
    int i = 0;       /* index in packed string  */
    int j = offset;  /* index in unpacked array */
    int l = packed.length();
    while (i < l) {
      int count = packed.charAt(i++);
      int value = packed.charAt(i++);
      value--;
      do result[j++] = value; while (--count > 0);
    }
    return j;
  }


  /** Error code for "Unknown internal scanner error". */
  private static final int ZZ_UNKNOWN_ERROR = 0;
  /** Error code for "could not match input". */
  private static final int ZZ_NO_MATCH = 1;
  /** Error code for "pushback value was too large". */
  private static final int ZZ_PUSHBACK_2BIG = 2;

  /**
   * Error messages for {@link #ZZ_UNKNOWN_ERROR}, {@link #ZZ_NO_MATCH}, and
   * {@link #ZZ_PUSHBACK_2BIG} respectively.
   */
  private static final String ZZ_ERROR_MSG[] = {
    "Unknown internal scanner error",
    "Error: could not match input",
    "Error: pushback value was too large"
  };

  /**
   * ZZ_ATTRIBUTE[aState] contains the attributes of state {@code aState}
   */
  private static final int [] ZZ_ATTRIBUTE = zzUnpackAttribute();

  private static final String ZZ_ATTRIBUTE_PACKED_0 =
    "\1\0\2\11\2\1\2\11\1\1\1\11\1\1\1\11"+
    "\11\1\2\11\35\0\1\11\1\0\1\11\2\0\3\11"+
    "\1\0\1\11\24\0\1\11\1\0\1\11\15\0\1\11"+
    "\5\0\1\1\26\0\1\1\12\0\1\1\22\0\1\11"+
    "\5\0\3\1";

  private static int [] zzUnpackAttribute() {
    int [] result = new int[165];
    int offset = 0;
    offset = zzUnpackAttribute(ZZ_ATTRIBUTE_PACKED_0, offset, result);
    return result;
  }

  private static int zzUnpackAttribute(String packed, int offset, int [] result) {
    int i = 0;       /* index in packed string  */
    int j = offset;  /* index in unpacked array */
    int l = packed.length();
    while (i < l) {
      int count = packed.charAt(i++);
      int value = packed.charAt(i++);
      do result[j++] = value; while (--count > 0);
    }
    return j;
  }

  /** Input device. */
  private java.io.Reader zzReader;

  /** Current state of the DFA. */
  private int zzState;

  /** Current lexical state. */
  private int zzLexicalState = YYINITIAL;

  /**
   * This buffer contains the current text to be matched and is the source of the {@link #yytext()}
   * string.
   */
  private char zzBuffer[] = new char[ZZ_BUFFERSIZE];

  /** Text position at the last accepting state. */
  private int zzMarkedPos;

  /** Current text position in the buffer. */
  private int zzCurrentPos;

  /** Marks the beginning of the {@link #yytext()} string in the buffer. */
  private int zzStartRead;

  /** Marks the last character in the buffer, that has been read from input. */
  private int zzEndRead;

  /**
   * Whether the scanner is at the end of file.
   * @see #yyatEOF
   */
  private boolean zzAtEOF;

  /**
   * The number of occupied positions in {@link #zzBuffer} beyond {@link #zzEndRead}.
   *
   * <p>When a lead/high surrogate has been read from the input stream into the final
   * {@link #zzBuffer} position, this will have a value of 1; otherwise, it will have a value of 0.
   */
  private int zzFinalHighSurrogate = 0;

  /** Number of newlines encountered up to the start of the matched text. */
  private int yyline;

  /** Number of characters from the last newline up to the start of the matched text. */
  private int yycolumn;

  /** Number of characters up to the start of the matched text. */
  @SuppressWarnings("unused")
  private long yychar;

  /** Whether the scanner is currently at the beginning of a line. */
  @SuppressWarnings("unused")
  private boolean zzAtBOL = true;

  /** Whether the user-EOF-code has already been executed. */
  private boolean zzEOFDone;

  /* user code: */
    private Symbol sym(int type){
	    return new Symbol(type, yyline, yycolumn);
	}
	private Symbol sym(int type, Object value){
	    return new Symbol(type, yyline, yycolumn, value);
	}


  /**
   * Creates a new scanner
   *
   * @param   in  the java.io.Reader to read input from.
   */
  Yylex(java.io.Reader in) {
    this.zzReader = in;
  }

  /**
   * Translates raw input code points to DFA table row
   */
  private static int zzCMap(int input) {
    int offset = input & 255;
    return offset == input ? ZZ_CMAP_BLOCKS[offset] : ZZ_CMAP_BLOCKS[ZZ_CMAP_TOP[input >> 8] | offset];
  }

  /**
   * Refills the input buffer.
   *
   * @return {@code false} iff there was new input.
   * @exception java.io.IOException  if any I/O-Error occurs
   */
  private boolean zzRefill() throws java.io.IOException {

    /* first: make room (if you can) */
    if (zzStartRead > 0) {
      zzEndRead += zzFinalHighSurrogate;
      zzFinalHighSurrogate = 0;
      System.arraycopy(zzBuffer, zzStartRead,
                       zzBuffer, 0,
                       zzEndRead - zzStartRead);

      /* translate stored positions */
      zzEndRead -= zzStartRead;
      zzCurrentPos -= zzStartRead;
      zzMarkedPos -= zzStartRead;
      zzStartRead = 0;
    }

    /* is the buffer big enough? */
    if (zzCurrentPos >= zzBuffer.length - zzFinalHighSurrogate) {
      /* if not: blow it up */
      char newBuffer[] = new char[zzBuffer.length * 2];
      System.arraycopy(zzBuffer, 0, newBuffer, 0, zzBuffer.length);
      zzBuffer = newBuffer;
      zzEndRead += zzFinalHighSurrogate;
      zzFinalHighSurrogate = 0;
    }

    /* fill the buffer with new input */
    int requested = zzBuffer.length - zzEndRead;
    int numRead = zzReader.read(zzBuffer, zzEndRead, requested);

    /* not supposed to occur according to specification of java.io.Reader */
    if (numRead == 0) {
      throw new java.io.IOException(
          "Reader returned 0 characters. See JFlex examples/zero-reader for a workaround.");
    }
    if (numRead > 0) {
      zzEndRead += numRead;
      if (Character.isHighSurrogate(zzBuffer[zzEndRead - 1])) {
        if (numRead == requested) { // We requested too few chars to encode a full Unicode character
          --zzEndRead;
          zzFinalHighSurrogate = 1;
        } else {                    // There is room in the buffer for at least one more char
          int c = zzReader.read();  // Expecting to read a paired low surrogate char
          if (c == -1) {
            return true;
          } else {
            zzBuffer[zzEndRead++] = (char)c;
          }
        }
      }
      /* potentially more input available */
      return false;
    }

    /* numRead < 0 ==> end of stream */
    return true;
  }


  /**
   * Closes the input reader.
   *
   * @throws java.io.IOException if the reader could not be closed.
   */
  public final void yyclose() throws java.io.IOException {
    zzAtEOF = true; // indicate end of file
    zzEndRead = zzStartRead; // invalidate buffer

    if (zzReader != null) {
      zzReader.close();
    }
  }


  /**
   * Resets the scanner to read from a new input stream.
   *
   * <p>Does not close the old reader.
   *
   * <p>All internal variables are reset, the old input stream <b>cannot</b> be reused (internal
   * buffer is discarded and lost). Lexical state is set to {@code ZZ_INITIAL}.
   *
   * <p>Internal scan buffer is resized down to its initial length, if it has grown.
   *
   * @param reader The new input stream.
   */
  public final void yyreset(java.io.Reader reader) {
    zzReader = reader;
    zzEOFDone = false;
    yyResetPosition();
    zzLexicalState = YYINITIAL;
    if (zzBuffer.length > ZZ_BUFFERSIZE) {
      zzBuffer = new char[ZZ_BUFFERSIZE];
    }
  }

  /**
   * Resets the input position.
   */
  private final void yyResetPosition() {
      zzAtBOL  = true;
      zzAtEOF  = false;
      zzCurrentPos = 0;
      zzMarkedPos = 0;
      zzStartRead = 0;
      zzEndRead = 0;
      zzFinalHighSurrogate = 0;
      yyline = 0;
      yycolumn = 0;
      yychar = 0L;
  }


  /**
   * Returns whether the scanner has reached the end of the reader it reads from.
   *
   * @return whether the scanner has reached EOF.
   */
  public final boolean yyatEOF() {
    return zzAtEOF;
  }


  /**
   * Returns the current lexical state.
   *
   * @return the current lexical state.
   */
  public final int yystate() {
    return zzLexicalState;
  }


  /**
   * Enters a new lexical state.
   *
   * @param newState the new lexical state
   */
  public final void yybegin(int newState) {
    zzLexicalState = newState;
  }


  /**
   * Returns the text matched by the current regular expression.
   *
   * @return the matched text.
   */
  public final String yytext() {
    return new String(zzBuffer, zzStartRead, zzMarkedPos-zzStartRead);
  }


  /**
   * Returns the character at the given position from the matched text.
   *
   * <p>It is equivalent to {@code yytext().charAt(pos)}, but faster.
   *
   * @param position the position of the character to fetch. A value from 0 to {@code yylength()-1}.
   *
   * @return the character at {@code position}.
   */
  public final char yycharat(int position) {
    return zzBuffer[zzStartRead + position];
  }


  /**
   * How many characters were matched.
   *
   * @return the length of the matched text region.
   */
  public final int yylength() {
    return zzMarkedPos-zzStartRead;
  }


  /**
   * Reports an error that occurred while scanning.
   *
   * <p>In a well-formed scanner (no or only correct usage of {@code yypushback(int)} and a
   * match-all fallback rule) this method will only be called with things that
   * "Can't Possibly Happen".
   *
   * <p>If this method is called, something is seriously wrong (e.g. a JFlex bug producing a faulty
   * scanner etc.).
   *
   * <p>Usual syntax/scanner level error handling should be done in error fallback rules.
   *
   * @param errorCode the code of the error message to display.
   */
  private static void zzScanError(int errorCode) {
    String message;
    try {
      message = ZZ_ERROR_MSG[errorCode];
    } catch (ArrayIndexOutOfBoundsException e) {
      message = ZZ_ERROR_MSG[ZZ_UNKNOWN_ERROR];
    }

    throw new Error(message);
  }


  /**
   * Pushes the specified amount of characters back into the input stream.
   *
   * <p>They will be read again by then next call of the scanning method.
   *
   * @param number the number of characters to be read again. This number must not be greater than
   *     {@link #yylength()}.
   */
  public void yypushback(int number)  {
    if ( number > yylength() )
      zzScanError(ZZ_PUSHBACK_2BIG);

    zzMarkedPos -= number;
  }


  /**
   * Contains user EOF-code, which will be executed exactly once,
   * when the end of file is reached
   */
  private void zzDoEOF() throws java.io.IOException {
    if (!zzEOFDone) {
      zzEOFDone = true;
    
  yyclose();    }
  }




  /**
   * Resumes scanning until the next regular expression is matched, the end of input is encountered
   * or an I/O-Error occurs.
   *
   * @return the next token.
   * @exception java.io.IOException if any I/O-Error occurs.
   */
  @Override  public java_cup.runtime.Symbol next_token() throws java.io.IOException {
    int zzInput;
    int zzAction;

    // cached fields:
    int zzCurrentPosL;
    int zzMarkedPosL;
    int zzEndReadL = zzEndRead;
    char[] zzBufferL = zzBuffer;

    int [] zzTransL = ZZ_TRANS;
    int [] zzRowMapL = ZZ_ROWMAP;
    int [] zzAttrL = ZZ_ATTRIBUTE;

    while (true) {
      zzMarkedPosL = zzMarkedPos;

      boolean zzR = false;
      int zzCh;
      int zzCharCount;
      for (zzCurrentPosL = zzStartRead  ;
           zzCurrentPosL < zzMarkedPosL ;
           zzCurrentPosL += zzCharCount ) {
        zzCh = Character.codePointAt(zzBufferL, zzCurrentPosL, zzMarkedPosL);
        zzCharCount = Character.charCount(zzCh);
        switch (zzCh) {
        case '\u000B':  // fall through
        case '\u000C':  // fall through
        case '\u0085':  // fall through
        case '\u2028':  // fall through
        case '\u2029':
          yyline++;
          yycolumn = 0;
          zzR = false;
          break;
        case '\r':
          yyline++;
          yycolumn = 0;
          zzR = true;
          break;
        case '\n':
          if (zzR)
            zzR = false;
          else {
            yyline++;
            yycolumn = 0;
          }
          break;
        default:
          zzR = false;
          yycolumn += zzCharCount;
        }
      }

      if (zzR) {
        // peek one character ahead if it is
        // (if we have counted one line too much)
        boolean zzPeek;
        if (zzMarkedPosL < zzEndReadL)
          zzPeek = zzBufferL[zzMarkedPosL] == '\n';
        else if (zzAtEOF)
          zzPeek = false;
        else {
          boolean eof = zzRefill();
          zzEndReadL = zzEndRead;
          zzMarkedPosL = zzMarkedPos;
          zzBufferL = zzBuffer;
          if (eof)
            zzPeek = false;
          else
            zzPeek = zzBufferL[zzMarkedPosL] == '\n';
        }
        if (zzPeek) yyline--;
      }
      zzAction = -1;

      zzCurrentPosL = zzCurrentPos = zzStartRead = zzMarkedPosL;

      zzState = ZZ_LEXSTATE[zzLexicalState];

      // set up zzAction for empty match case:
      int zzAttributes = zzAttrL[zzState];
      if ( (zzAttributes & 1) == 1 ) {
        zzAction = zzState;
      }


      zzForAction: {
        while (true) {

          if (zzCurrentPosL < zzEndReadL) {
            zzInput = Character.codePointAt(zzBufferL, zzCurrentPosL, zzEndReadL);
            zzCurrentPosL += Character.charCount(zzInput);
          }
          else if (zzAtEOF) {
            zzInput = YYEOF;
            break zzForAction;
          }
          else {
            // store back cached positions
            zzCurrentPos  = zzCurrentPosL;
            zzMarkedPos   = zzMarkedPosL;
            boolean eof = zzRefill();
            // get translated positions and possibly new buffer
            zzCurrentPosL  = zzCurrentPos;
            zzMarkedPosL   = zzMarkedPos;
            zzBufferL      = zzBuffer;
            zzEndReadL     = zzEndRead;
            if (eof) {
              zzInput = YYEOF;
              break zzForAction;
            }
            else {
              zzInput = Character.codePointAt(zzBufferL, zzCurrentPosL, zzEndReadL);
              zzCurrentPosL += Character.charCount(zzInput);
            }
          }
          int zzNext = zzTransL[ zzRowMapL[zzState] + zzCMap(zzInput) ];
          if (zzNext == -1) break zzForAction;
          zzState = zzNext;

          zzAttributes = zzAttrL[zzState];
          if ( (zzAttributes & 1) == 1 ) {
            zzAction = zzState;
            zzMarkedPosL = zzCurrentPosL;
            if ( (zzAttributes & 8) == 8 ) break zzForAction;
          }

        }
      }

      // store back cached position
      zzMarkedPos = zzMarkedPosL;

      if (zzInput == YYEOF && zzStartRead == zzCurrentPos) {
        zzAtEOF = true;
            zzDoEOF();
          { return new java_cup.runtime.Symbol(sym.EOF); }
      }
      else {
        switch (zzAction < 0 ? zzAction : ZZ_ACTION[zzAction]) {
          case 1:
            { System.out.println("Scanner error: " + yytext());
            }
            // fall through
          case 22: break;
          case 2:
            { ;
            }
            // fall through
          case 23: break;
          case 3:
            { return sym(sym.CM);
            }
            // fall through
          case 24: break;
          case 4:
            { return sym(sym.UINT,new Integer(yytext()));
            }
            // fall through
          case 25: break;
          case 5:
            { return sym(sym.S);
            }
            // fall through
          case 26: break;
          case 6:
            { return sym(sym.EQ);
            }
            // fall through
          case 27: break;
          case 7:
            { return sym(sym.MAJ);
            }
            // fall through
          case 28: break;
          case 8:
            { return sym(sym.SO);
            }
            // fall through
          case 29: break;
          case 9:
            { return sym(sym.SC);
            }
            // fall through
          case 30: break;
          case 10:
            { return sym(sym.MUL);
            }
            // fall through
          case 31: break;
          case 11:
            { return sym(sym.SUM);
            }
            // fall through
          case 32: break;
          case 12:
            { return sym(sym.SEP);
            }
            // fall through
          case 33: break;
          case 13:
            { return sym(sym.COND_WD);
            }
            // fall through
          case 34: break;
          case 14:
            { return sym(sym.DONE);
            }
            // fall through
          case 35: break;
          case 15:
            { return sym(sym.INIT_WD);
            }
            // fall through
          case 36: break;
          case 16:
            { return sym(sym.SPEED_WD);
            }
            // fall through
          case 37: break;
          case 17:
            { return sym(sym.HEIGHT_WD);
            }
            // fall through
          case 38: break;
          case 18:
            { return sym(sym.UPDATE_WD);
            }
            // fall through
          case 39: break;
          case 19:
            { return sym(sym.TK3);
            }
            // fall through
          case 40: break;
          case 20:
            { return sym(sym.TK1);
            }
            // fall through
          case 41: break;
          case 21:
            { return sym(sym.TK2);
            }
            // fall through
          case 42: break;
          default:
            zzScanError(ZZ_NO_MATCH);
        }
      }
    }
  }


}
