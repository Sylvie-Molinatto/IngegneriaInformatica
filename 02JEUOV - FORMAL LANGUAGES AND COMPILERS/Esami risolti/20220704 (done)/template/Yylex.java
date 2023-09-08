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
    "\11\0\1\1\1\2\2\3\1\4\22\0\1\1\1\5"+
    "\1\6\3\0\1\7\1\0\1\10\1\11\2\12\1\0"+
    "\1\13\1\0\1\14\1\15\1\16\1\17\1\20\2\21"+
    "\4\22\1\0\1\23\1\0\1\24\1\0\1\25\1\0"+
    "\1\26\1\27\1\30\1\31\1\32\1\33\2\34\1\35"+
    "\1\36\1\34\1\37\1\34\1\40\1\41\1\42\1\34"+
    "\1\43\1\44\1\45\1\46\2\34\1\47\1\50\1\51"+
    "\1\52\1\0\1\53\1\0\1\34\1\0\1\54\1\55"+
    "\1\56\1\57\1\60\1\57\1\61\4\34\1\62\1\63"+
    "\1\64\1\65\1\66\1\34\1\67\1\70\1\71\1\72"+
    "\1\73\2\34\1\74\1\34\1\0\1\75\10\0\1\3"+
    "\u01a2\0\2\3\326\0\u0100\3";

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
    "\1\0\1\1\2\2\1\3\1\1\1\4\1\5\1\6"+
    "\1\7\1\10\12\11\1\1\1\12\1\0\1\13\1\0"+
    "\1\11\1\0\1\14\1\11\1\15\1\16\1\0\1\17"+
    "\1\11\1\0\1\11\2\0\1\20\4\0\2\11\5\0"+
    "\1\11\3\0\1\11\1\0\1\21\4\0\1\22\1\11"+
    "\3\0\1\11\1\0\1\23\5\0\1\24\1\0\1\25"+
    "\75\0\1\26\20\0\1\26\12\0\1\27\1\0\2\26"+
    "\17\0\3\30\1\26\13\0\1\26\22\0\1\26\16\0"+
    "\1\26\12\0\1\26\7\0\1\26\1\0\1\27\4\0"+
    "\1\26\4\0\1\26\3\0\1\26";

  private static int [] zzUnpackAction() {
    int [] result = new int[271];
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
    "\0\0\0\76\0\76\0\174\0\76\0\272\0\76\0\76"+
    "\0\76\0\76\0\370\0\u0136\0\u0174\0\u01b2\0\u01f0\0\u022e"+
    "\0\u026c\0\u02aa\0\u02e8\0\u0326\0\u0364\0\u03a2\0\76\0\272"+
    "\0\76\0\u03e0\0\u041e\0\u045c\0\u049a\0\u04d8\0\u0174\0\u0174"+
    "\0\u0516\0\u0174\0\u0554\0\u0592\0\u05d0\0\u060e\0\u064c\0\u0174"+
    "\0\u068a\0\u06c8\0\u0706\0\u0744\0\u0782\0\u07c0\0\u07fe\0\u083c"+
    "\0\u087a\0\u08b8\0\u08f6\0\u0934\0\u0972\0\u09b0\0\u09ee\0\u0a2c"+
    "\0\u0a6a\0\76\0\u0aa8\0\u0ae6\0\u0b24\0\u0b62\0\u0174\0\u0ba0"+
    "\0\u0bde\0\u0c1c\0\u0c5a\0\u0c98\0\u0cd6\0\u0174\0\u0d14\0\u0d52"+
    "\0\u0d90\0\u0dce\0\u0e0c\0\u0174\0\u0e4a\0\u0174\0\u0e88\0\u0ec6"+
    "\0\u0f04\0\u0f42\0\u0f80\0\u0fbe\0\u0ffc\0\u103a\0\u1078\0\u10b6"+
    "\0\u10f4\0\u1132\0\u1170\0\u11ae\0\u11ec\0\u122a\0\u1268\0\u12a6"+
    "\0\u12e4\0\u1322\0\u1360\0\u139e\0\u13dc\0\u141a\0\u1458\0\u1496"+
    "\0\u14d4\0\u1512\0\u1550\0\u158e\0\u15cc\0\u160a\0\u1648\0\u1686"+
    "\0\u16c4\0\u1702\0\u1740\0\u177e\0\u17bc\0\u17fa\0\u1838\0\u1876"+
    "\0\u18b4\0\u18f2\0\u1930\0\u196e\0\u19ac\0\u19ea\0\u1a28\0\u1a66"+
    "\0\u1aa4\0\u1ae2\0\u1b20\0\u1b5e\0\u1b9c\0\u1bda\0\u1c18\0\u1c56"+
    "\0\u1c94\0\u1cd2\0\u1d10\0\u1d4e\0\u1d8c\0\u1dca\0\u1e08\0\u1e46"+
    "\0\u1e84\0\u1ec2\0\u1f00\0\u1f3e\0\u1f7c\0\u1fba\0\u1ff8\0\u2036"+
    "\0\u2074\0\u20b2\0\u20f0\0\u212e\0\u216c\0\u21aa\0\u21e8\0\u2226"+
    "\0\u2264\0\u22a2\0\u22e0\0\u231e\0\u235c\0\u239a\0\u23d8\0\u2416"+
    "\0\u2454\0\u212e\0\u2492\0\u24d0\0\u250e\0\u254c\0\u258a\0\u25c8"+
    "\0\u2606\0\u2644\0\u2682\0\u26c0\0\u26fe\0\u273c\0\u277a\0\u27b8"+
    "\0\u27f6\0\u2834\0\u2872\0\u28b0\0\u1d10\0\u28ee\0\u292c\0\u296a"+
    "\0\u29a8\0\u29e6\0\u2a24\0\u2a62\0\u2aa0\0\u2ade\0\u2b1c\0\u2b5a"+
    "\0\u2b98\0\u2bd6\0\u2c14\0\u2c52\0\u2c90\0\u2cce\0\u2d0c\0\u2d4a"+
    "\0\u2d88\0\u2dc6\0\u2e04\0\u2e42\0\u2e80\0\u2ebe\0\u2efc\0\u2f3a"+
    "\0\u2f78\0\u2fb6\0\u2ff4\0\u3032\0\u3070\0\u30ae\0\u30ec\0\u312a"+
    "\0\u3168\0\u31a6\0\u31e4\0\u3222\0\u3260\0\u329e\0\u32dc\0\u331a"+
    "\0\u3358\0\u3396\0\u33d4\0\u3412\0\u3450\0\u348e\0\u34cc\0\u350a"+
    "\0\u3548\0\u3586\0\u35c4\0\u3602\0\u3640\0\u367e\0\u36bc\0\u36fa"+
    "\0\u3738\0\u3776\0\u37b4\0\u37f2\0\u3830\0\u386e\0\u38ac\0\u38ea"+
    "\0\76\0\u3928\0\u3966\0\u39a4\0\u39e2\0\u3a20\0\u3a5e\0\u3a9c"+
    "\0\u3ada\0\u3b18\0\u3b56\0\u3b94\0\u3bd2\0\u3c10\0\u3c4e";

  private static int [] zzUnpackRowMap() {
    int [] result = new int[271];
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
    "\1\2\2\3\1\0\1\4\1\5\1\6\1\7\1\10"+
    "\1\11\11\2\1\12\1\13\1\2\1\14\2\15\1\16"+
    "\1\15\1\17\1\15\1\20\2\15\1\21\1\22\1\23"+
    "\1\24\1\15\1\25\4\15\1\26\1\2\21\15\1\27"+
    "\100\0\1\3\73\0\6\30\1\31\67\30\24\0\1\32"+
    "\66\0\6\15\3\0\12\15\1\33\11\15\2\0\21\15"+
    "\16\0\6\15\3\0\24\15\2\0\21\15\14\0\1\34"+
    "\1\0\6\15\3\0\13\15\1\35\10\15\2\0\21\15"+
    "\16\0\6\15\3\0\1\36\6\15\1\37\14\15\2\0"+
    "\21\15\16\0\6\15\3\0\5\15\1\40\16\15\2\0"+
    "\21\15\14\0\1\41\1\0\6\15\3\0\24\15\2\0"+
    "\21\15\16\0\6\15\3\0\15\15\1\42\6\15\2\0"+
    "\21\15\16\0\6\15\3\0\15\15\1\43\6\15\2\0"+
    "\21\15\14\0\1\44\1\0\6\15\3\0\24\15\2\0"+
    "\21\15\16\0\6\15\3\0\15\15\1\45\6\15\2\0"+
    "\21\15\53\0\1\46\47\0\1\47\66\0\6\15\3\0"+
    "\3\15\1\50\20\15\2\0\21\15\16\0\1\51\1\52"+
    "\1\53\1\54\72\0\6\15\3\0\12\15\1\55\11\15"+
    "\2\0\21\15\16\0\6\15\3\0\11\15\1\56\12\15"+
    "\2\0\21\15\17\0\1\57\1\60\3\61\3\0\1\61"+
    "\1\62\4\63\20\0\1\61\1\62\3\63\32\0\6\15"+
    "\3\0\7\15\1\64\14\15\2\0\21\15\50\0\1\65"+
    "\1\66\1\67\41\0\6\15\3\0\20\15\1\70\3\15"+
    "\2\0\21\15\14\0\1\71\106\0\1\72\67\0\3\73"+
    "\2\74\70\0\5\74\1\75\70\0\6\75\70\0\1\75"+
    "\1\76\74\0\6\15\3\0\4\15\1\77\17\15\2\0"+
    "\21\15\16\0\6\15\3\0\16\15\1\100\5\15\2\0"+
    "\21\15\16\0\6\63\3\0\6\63\20\0\5\63\32\0"+
    "\6\63\3\0\6\101\20\0\5\101\32\0\6\101\3\0"+
    "\6\101\20\0\5\101\32\0\6\101\3\0\2\101\1\102"+
    "\3\103\20\0\2\101\1\102\2\103\32\0\6\103\3\0"+
    "\6\103\20\0\5\103\32\0\6\15\3\0\12\15\1\104"+
    "\11\15\2\0\21\15\50\0\1\105\76\0\1\105\76\0"+
    "\1\105\41\0\6\15\3\0\4\15\1\106\17\15\2\0"+
    "\21\15\14\0\1\107\76\0\1\110\75\0\1\111\75\0"+
    "\1\112\75\0\1\113\76\0\6\15\3\0\4\15\1\114"+
    "\17\15\2\0\21\15\13\0\1\115\1\0\1\115\6\103"+
    "\3\0\6\103\20\0\5\103\27\0\1\115\1\0\1\115"+
    "\4\103\67\0\1\115\1\0\1\115\76\0\6\15\3\0"+
    "\17\15\1\116\4\15\2\0\21\15\50\0\1\117\1\120"+
    "\1\121\24\0\13\107\1\122\62\107\26\0\1\123\2\0"+
    "\1\124\4\0\1\125\1\0\1\126\1\127\2\0\1\130"+
    "\57\0\1\123\2\0\1\124\4\0\1\131\1\0\1\126"+
    "\1\127\2\0\1\130\57\0\1\123\2\0\1\124\4\0"+
    "\1\132\1\0\1\126\1\127\2\0\1\130\57\0\1\123"+
    "\2\0\1\124\4\0\1\132\2\0\1\127\52\0\1\133"+
    "\1\134\3\135\3\0\1\135\1\136\4\137\20\0\1\135"+
    "\1\136\3\137\64\0\1\140\76\0\1\140\76\0\1\140"+
    "\24\0\13\107\1\141\62\107\72\0\1\142\63\0\1\143"+
    "\71\0\1\144\106\0\1\145\66\0\1\146\77\0\1\147"+
    "\71\0\1\144\15\0\1\150\75\0\1\150\20\0\6\137"+
    "\3\0\6\137\20\0\5\137\32\0\6\137\3\0\6\151"+
    "\20\0\5\151\32\0\6\151\3\0\6\151\20\0\5\151"+
    "\32\0\6\151\3\0\2\151\1\152\3\153\20\0\2\151"+
    "\1\152\2\153\32\0\6\153\3\0\6\153\20\0\5\153"+
    "\64\0\1\154\1\155\1\156\24\0\13\107\1\141\37\107"+
    "\1\157\22\107\61\0\1\160\72\0\1\161\103\0\1\162"+
    "\104\0\1\161\73\0\1\163\72\0\1\164\71\0\1\165"+
    "\25\0\1\166\1\0\1\166\6\153\3\0\6\153\20\0"+
    "\5\153\27\0\1\166\1\0\1\166\4\153\67\0\1\166"+
    "\1\0\1\166\130\0\1\167\76\0\1\167\76\0\1\167"+
    "\24\0\13\107\1\122\37\107\1\3\22\107\72\0\1\170"+
    "\63\0\1\171\107\0\1\172\70\0\1\173\101\0\1\161"+
    "\100\0\1\174\17\0\1\175\1\176\3\177\3\0\1\177"+
    "\1\200\4\201\20\0\1\177\1\200\3\201\64\0\1\202"+
    "\1\203\1\204\114\0\1\205\70\0\1\173\66\0\1\206"+
    "\76\0\1\207\34\0\1\210\76\0\6\201\3\0\6\201"+
    "\20\0\5\201\32\0\6\201\3\0\6\211\20\0\5\211"+
    "\32\0\6\211\3\0\6\211\20\0\5\211\32\0\6\211"+
    "\3\0\2\211\1\212\3\213\20\0\2\211\1\212\2\213"+
    "\32\0\6\213\3\0\6\213\20\0\5\213\64\0\1\214"+
    "\76\0\1\214\76\0\1\214\115\0\1\174\73\0\1\215"+
    "\66\0\1\216\34\0\1\217\70\0\1\220\1\0\1\220"+
    "\6\213\3\0\6\213\20\0\5\213\27\0\1\220\1\0"+
    "\1\220\4\213\67\0\1\220\1\0\1\220\106\0\1\221"+
    "\21\0\1\222\1\223\1\224\120\0\1\225\70\0\1\174"+
    "\23\0\1\226\76\0\1\227\1\230\3\231\3\0\1\231"+
    "\1\232\4\233\20\0\1\231\1\232\3\233\42\0\1\234"+
    "\117\0\1\235\76\0\1\235\76\0\1\235\40\0\1\236"+
    "\100\0\1\237\73\0\6\233\3\0\6\233\20\0\5\233"+
    "\32\0\6\233\3\0\6\240\20\0\5\240\32\0\6\240"+
    "\3\0\6\240\20\0\5\240\32\0\6\240\3\0\2\240"+
    "\1\241\3\242\20\0\2\240\1\241\2\242\32\0\6\242"+
    "\3\0\6\242\20\0\5\242\42\0\1\243\75\0\1\221"+
    "\21\0\1\244\1\245\1\246\43\0\1\247\75\0\1\250"+
    "\70\0\1\251\1\0\1\251\6\242\3\0\6\242\20\0"+
    "\5\242\27\0\1\251\1\0\1\251\4\242\67\0\1\251"+
    "\1\0\1\251\106\0\1\252\117\0\1\253\76\0\1\253"+
    "\76\0\1\253\41\0\1\254\73\0\1\255\100\0\1\256"+
    "\1\257\3\260\3\0\1\260\1\261\4\262\20\0\1\260"+
    "\1\261\3\262\42\0\1\221\21\0\1\263\1\264\1\265"+
    "\43\0\1\266\73\0\1\267\1\270\1\271\1\272\72\0"+
    "\6\262\3\0\6\262\20\0\5\262\32\0\6\262\3\0"+
    "\6\273\20\0\5\273\32\0\6\273\3\0\6\273\20\0"+
    "\5\273\32\0\6\273\3\0\2\273\1\274\3\275\20\0"+
    "\2\273\1\274\2\275\32\0\6\275\3\0\6\275\20\0"+
    "\5\275\64\0\1\276\76\0\1\276\76\0\1\276\44\0"+
    "\1\250\73\0\3\277\2\300\70\0\5\300\1\301\70\0"+
    "\6\301\70\0\1\301\1\302\71\0\1\220\1\0\1\220"+
    "\6\275\3\0\6\275\20\0\5\275\27\0\1\220\1\0"+
    "\1\220\4\275\102\0\1\221\21\0\1\303\1\304\1\305"+
    "\40\0\1\306\75\0\1\307\75\0\1\310\75\0\1\311"+
    "\130\0\1\312\76\0\1\312\76\0\1\312\52\0\1\313"+
    "\2\0\1\314\4\0\1\315\1\0\1\316\1\317\2\0"+
    "\1\320\57\0\1\313\2\0\1\314\4\0\1\321\1\0"+
    "\1\316\1\317\2\0\1\320\57\0\1\313\2\0\1\314"+
    "\4\0\1\322\1\0\1\316\1\317\2\0\1\320\57\0"+
    "\1\313\2\0\1\314\4\0\1\322\2\0\1\317\61\0"+
    "\1\221\21\0\1\323\1\324\1\325\116\0\1\326\63\0"+
    "\1\327\71\0\1\330\106\0\1\331\66\0\1\332\77\0"+
    "\1\333\71\0\1\330\15\0\1\334\75\0\1\334\52\0"+
    "\1\335\76\0\1\335\76\0\1\335\105\0\1\336\72\0"+
    "\1\337\103\0\1\340\104\0\1\337\73\0\1\341\72\0"+
    "\1\342\71\0\1\343\40\0\1\221\21\0\1\344\1\345"+
    "\1\346\116\0\1\347\63\0\1\350\107\0\1\351\70\0"+
    "\1\352\101\0\1\337\100\0\1\353\50\0\1\354\76\0"+
    "\1\354\76\0\1\354\114\0\1\355\70\0\1\352\66\0"+
    "\1\356\76\0\1\357\34\0\1\360\106\0\1\221\21\0"+
    "\1\361\1\362\1\363\115\0\1\353\73\0\1\364\66\0"+
    "\1\365\34\0\1\366\125\0\1\367\76\0\1\367\76\0"+
    "\1\367\120\0\1\370\70\0\1\353\23\0\1\371\105\0"+
    "\1\221\21\0\1\372\1\373\1\374\40\0\1\375\100\0"+
    "\1\376\125\0\1\377\76\0\1\377\76\0\1\377\43\0"+
    "\1\u0100\75\0\1\u0101\103\0\1\221\21\0\1\u0102\1\u0103"+
    "\1\u0104\41\0\1\u0105\127\0\1\u0106\76\0\1\u0106\76\0"+
    "\1\u0106\43\0\1\u0107\103\0\1\221\21\0\1\u0108\1\u0109"+
    "\1\u010a\44\0\1\u0101\124\0\1\u010b\76\0\1\u010b\76\0"+
    "\1\u010b\51\0\1\221\21\0\1\u010c\1\u010d\1\u010e\73\0"+
    "\1\u010f\76\0\1\u010f\76\0\1\u010f\51\0\1\221\50\0";

  private static int [] zzUnpackTrans() {
    int [] result = new int[15500];
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
    "\1\0\2\11\1\1\1\11\1\1\4\11\14\1\1\11"+
    "\1\0\1\11\1\0\1\1\1\0\4\1\1\0\2\1"+
    "\1\0\1\1\2\0\1\1\4\0\2\1\5\0\1\1"+
    "\3\0\1\1\1\0\1\11\4\0\2\1\3\0\1\1"+
    "\1\0\1\1\5\0\1\1\1\0\1\1\75\0\1\1"+
    "\20\0\1\1\12\0\1\1\1\0\2\1\17\0\4\1"+
    "\13\0\1\1\22\0\1\1\16\0\1\1\12\0\1\1"+
    "\7\0\1\1\1\0\1\11\4\0\1\1\4\0\1\1"+
    "\3\0\1\1";

  private static int [] zzUnpackAttribute() {
    int [] result = new int[271];
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
          case 25: break;
          case 2:
            { ;
            }
            // fall through
          case 26: break;
          case 3:
            { return sym(sym.NOT);
            }
            // fall through
          case 27: break;
          case 4:
            { return sym(sym.AND);
            }
            // fall through
          case 28: break;
          case 5:
            { return sym(sym.RO);
            }
            // fall through
          case 29: break;
          case 6:
            { return sym(sym.RC);
            }
            // fall through
          case 30: break;
          case 7:
            { return sym(sym.S);
            }
            // fall through
          case 31: break;
          case 8:
            { return sym(sym.EQ);
            }
            // fall through
          case 32: break;
          case 9:
            { return sym(sym.ID);
            }
            // fall through
          case 33: break;
          case 10:
            { return sym(sym.OR);
            }
            // fall through
          case 34: break;
          case 11:
            { return sym(sym.QSTRING,new String(yytext()));
            }
            // fall through
          case 35: break;
          case 12:
            { return sym(sym.DO);
            }
            // fall through
          case 36: break;
          case 13:
            { return sym(sym.FI);
            }
            // fall through
          case 37: break;
          case 14:
            { return sym(sym.IF);
            }
            // fall through
          case 38: break;
          case 15:
            { return sym(sym.OR_WORD);
            }
            // fall through
          case 39: break;
          case 16:
            { return sym(sym.AND_WORD);
            }
            // fall through
          case 40: break;
          case 17:
            { return sym(sym.SEP);
            }
            // fall through
          case 41: break;
          case 18:
            { return sym(sym.DONE);
            }
            // fall through
          case 42: break;
          case 19:
            { return sym(sym.TRUE);
            }
            // fall through
          case 43: break;
          case 20:
            { return sym(sym.FALSE);
            }
            // fall through
          case 44: break;
          case 21:
            { return sym(sym.PRINT);
            }
            // fall through
          case 45: break;
          case 22:
            { return sym(sym.TK2);
            }
            // fall through
          case 46: break;
          case 23:
            { return sym(sym.TK1);
            }
            // fall through
          case 47: break;
          case 24:
            { return sym(sym.TK3);
            }
            // fall through
          case 48: break;
          default:
            zzScanError(ZZ_NO_MATCH);
        }
      }
    }
  }


}