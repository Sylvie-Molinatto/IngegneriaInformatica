
//----------------------------------------------------
// The following code was generated by CUP v0.11b beta 20140226
//----------------------------------------------------

import java_cup.runtime.*;
import java.util.*;
import java.io.*;
import java_cup.runtime.XMLElement;

/** CUP v0.11b beta 20140226 generated parser.
  */
@SuppressWarnings({"rawtypes"})
public class parser extends java_cup.runtime.lr_parser {

 public final Class getSymbolContainer() {
    return sym.class;
}

  /** Default constructor. */
  @Deprecated
  public parser() {super();}

  /** Constructor which sets the default scanner. */
  @Deprecated
  public parser(java_cup.runtime.Scanner s) {super(s);}

  /** Constructor which sets the default scanner. */
  public parser(java_cup.runtime.Scanner s, java_cup.runtime.SymbolFactory sf) {super(s,sf);}

  /** Production table. */
  protected static final short _production_table[][] = 
    unpackFromStrings(new String[] {
    "\000\037\000\002\002\004\000\002\002\007\000\002\003" +
    "\004\000\002\003\004\000\002\003\004\000\002\003\010" +
    "\000\002\003\013\000\002\005\012\000\002\005\007\000" +
    "\002\006\010\000\002\007\005\000\002\010\006\000\002" +
    "\011\005\000\002\011\002\000\002\004\004\000\002\004" +
    "\005\000\002\012\007\000\002\016\007\000\002\016\005" +
    "\000\002\013\004\000\002\013\002\000\002\024\002\000" +
    "\002\014\011\000\002\021\002\000\002\022\002\000\002" +
    "\020\006\000\002\020\004\000\002\023\006\000\002\015" +
    "\005\000\002\015\003\000\002\017\005" });

  /** Access to production table. */
  public short[][] production_table() {return _production_table;}

  /** Parse-action table. */
  protected static final short[][] _action_table = 
    unpackFromStrings(new String[] {
    "\000\123\000\006\004\007\005\006\001\002\000\004\002" +
    "\125\001\002\000\004\010\052\001\002\000\004\006\040" +
    "\001\002\000\004\006\031\001\002\000\006\004\014\005" +
    "\013\001\002\000\004\010\ufffd\001\002\000\006\005\013" +
    "\010\uffff\001\002\000\004\006\021\001\002\000\004\006" +
    "\016\001\002\000\004\010\ufffe\001\002\000\004\004\017" +
    "\001\002\000\004\006\020\001\002\000\006\004\ufff9\005" +
    "\ufff9\001\002\000\004\005\022\001\002\000\004\006\023" +
    "\001\002\000\004\005\024\001\002\000\004\006\025\001" +
    "\002\000\006\005\ufff8\010\ufff8\001\002\000\004\005\013" +
    "\001\002\000\006\005\013\010\ufff7\001\002\000\004\010" +
    "\ufff6\001\002\000\004\004\032\001\002\000\004\006\033" +
    "\001\002\000\004\004\034\001\002\000\004\006\035\001" +
    "\002\000\004\004\036\001\002\000\004\006\037\001\002" +
    "\000\006\004\ufffa\005\ufffa\001\002\000\006\004\ufff4\005" +
    "\ufff4\001\002\000\006\004\043\005\042\001\002\000\004" +
    "\006\045\001\002\000\004\006\044\001\002\000\010\004" +
    "\ufff5\005\ufff5\010\ufff5\001\002\000\010\004\ufff4\005\ufff4" +
    "\010\ufff4\001\002\000\010\004\043\005\047\010\ufffc\001" +
    "\002\000\004\006\050\001\002\000\006\004\ufff4\010\ufff4" +
    "\001\002\000\006\004\043\010\ufffb\001\002\000\004\011" +
    "\055\001\002\000\006\010\072\011\055\001\002\000\004" +
    "\011\055\001\002\000\004\017\057\001\002\000\006\012" +
    "\063\013\062\001\002\000\004\021\060\001\002\000\004" +
    "\014\061\001\002\000\006\012\uffef\013\uffef\001\002\000" +
    "\004\017\066\001\002\000\004\017\064\001\002\000\004" +
    "\006\065\001\002\000\006\010\ufff1\011\ufff1\001\002\000" +
    "\004\021\067\001\002\000\004\014\070\001\002\000\006" +
    "\012\ufff0\013\ufff0\001\002\000\006\010\ufff3\011\ufff3\001" +
    "\002\000\006\002\uffed\021\uffed\001\002\000\004\011\055" +
    "\001\002\000\006\010\ufff2\011\ufff2\001\002\000\006\002" +
    "\000\021\076\001\002\000\004\015\100\001\002\000\006" +
    "\002\uffee\021\uffee\001\002\000\004\017\101\001\002\000" +
    "\004\007\uffec\001\002\000\004\007\103\001\002\000\004" +
    "\017\uffe9\001\002\000\006\006\122\013\121\001\002\000" +
    "\004\017\107\001\002\000\006\006\uffe7\013\uffe7\001\002" +
    "\000\004\011\110\001\002\000\004\017\113\001\002\000" +
    "\006\012\117\013\116\001\002\000\006\012\uffe4\013\uffe4" +
    "\001\002\000\004\020\114\001\002\000\004\016\115\001" +
    "\002\000\006\012\uffe3\013\uffe3\001\002\000\004\017\113" +
    "\001\002\000\006\006\uffe6\013\uffe6\001\002\000\006\012" +
    "\uffe5\013\uffe5\001\002\000\004\017\uffea\001\002\000\006" +
    "\002\uffeb\021\uffeb\001\002\000\004\017\107\001\002\000" +
    "\006\006\uffe8\013\uffe8\001\002\000\004\002\001\001\002" +
    "" });

  /** Access to parse-action table. */
  public short[][] action_table() {return _action_table;}

  /** <code>reduce_goto</code> table. */
  protected static final short[][] _reduce_table = 
    unpackFromStrings(new String[] {
    "\000\123\000\010\002\003\003\004\005\007\001\001\000" +
    "\002\001\001\000\002\001\001\000\002\001\001\000\002" +
    "\001\001\000\010\006\011\007\014\010\010\001\001\000" +
    "\002\001\001\000\004\006\025\001\001\000\002\001\001" +
    "\000\002\001\001\000\002\001\001\000\002\001\001\000" +
    "\002\001\001\000\002\001\001\000\002\001\001\000\002" +
    "\001\001\000\002\001\001\000\002\001\001\000\002\001" +
    "\001\000\004\006\026\001\001\000\004\006\027\001\001" +
    "\000\002\001\001\000\002\001\001\000\002\001\001\000" +
    "\002\001\001\000\002\001\001\000\002\001\001\000\002" +
    "\001\001\000\002\001\001\000\004\011\040\001\001\000" +
    "\002\001\001\000\002\001\001\000\002\001\001\000\002" +
    "\001\001\000\004\011\045\001\001\000\002\001\001\000" +
    "\002\001\001\000\004\011\050\001\001\000\002\001\001" +
    "\000\006\004\052\012\053\001\001\000\004\012\072\001" +
    "\001\000\004\012\070\001\001\000\004\016\055\001\001" +
    "\000\002\001\001\000\002\001\001\000\002\001\001\000" +
    "\002\001\001\000\002\001\001\000\002\001\001\000\002" +
    "\001\001\000\002\001\001\000\002\001\001\000\002\001" +
    "\001\000\002\001\001\000\002\001\001\000\004\013\074" +
    "\001\001\000\004\012\073\001\001\000\002\001\001\000" +
    "\004\014\076\001\001\000\002\001\001\000\002\001\001" +
    "\000\002\001\001\000\004\024\101\001\001\000\002\001" +
    "\001\000\006\020\103\022\104\001\001\000\002\001\001" +
    "\000\004\023\105\001\001\000\002\001\001\000\002\001" +
    "\001\000\006\015\110\017\111\001\001\000\002\001\001" +
    "\000\002\001\001\000\002\001\001\000\002\001\001\000" +
    "\002\001\001\000\004\017\117\001\001\000\002\001\001" +
    "\000\002\001\001\000\004\021\122\001\001\000\002\001" +
    "\001\000\004\023\123\001\001\000\002\001\001\000\002" +
    "\001\001" });

  /** Access to <code>reduce_goto</code> table. */
  public short[][] reduce_table() {return _reduce_table;}

  /** Instance of action encapsulation class. */
  protected CUP$parser$actions action_obj;

  /** Action encapsulation object initializer. */
  protected void init_actions()
    {
      action_obj = new CUP$parser$actions(this);
    }

  /** Invoke a user supplied parse action. */
  public java_cup.runtime.Symbol do_action(
    int                        act_num,
    java_cup.runtime.lr_parser parser,
    java.util.Stack            stack,
    int                        top)
    throws java.lang.Exception
  {
    /* call code in generated class */
    return action_obj.CUP$parser$do_action(act_num, parser, stack, top);
  }

  /** Indicates start state. */
  public int start_state() {return 0;}
  /** Indicates start production. */
  public int start_production() {return 0;}

  /** <code>EOF</code> Symbol index. */
  public int EOF_sym() {return 0;}

  /** <code>error</code> Symbol index. */
  public int error_sym() {return 1;}


  /** User initialization code. */
  public void user_init() throws java.lang.Exception
    {

    table = new HashMap<String, HashMap<String, Double>>();

 Tree = new DisegnaAlbero();   }public static DisegnaAlbero Tree;

  /** Scan to get the next Symbol. */
  public java_cup.runtime.Symbol scan()
    throws java.lang.Exception
    {
 Symbol s=_scanner.next_token(); Tree.push(s.toString(), 0); return s;   }


    public HashMap<String, HashMap<String, Double>> table;

    public void report_error(String message, Object info){
        StringBuffer m = new StringBuffer(message);
        if (info instanceof Symbol){
            if(((Symbol)info).left != 1 && ((Symbol)info).right != 1){
                if(((Symbol)info).left != -1 && ((Symbol)info).right != -1){
                    int line = (((Symbol)info).left) + 1;
                    int column = (((Symbol)info).right) + 1;
                    m.append("(line" + line + "column " + column + ")");
                }
            }
            System.err.println(m);
        }
    }

     // Return semantic value of symbol in position (position)
    public Object stack(int position) {
        return (((Symbol)stack.elementAt(tos+position)).value);
    }



/** Cup generated class to encapsulate user supplied action code.*/
@SuppressWarnings({"rawtypes", "unchecked", "unused"})
class CUP$parser$actions {
  private final parser parser;

  /** Constructor */
  CUP$parser$actions(parser parser) {
    this.parser = parser;
  }

  /** Method 0 with the actual generated action code for actions 0 to 300. */
  public final java_cup.runtime.Symbol CUP$parser$do_action_part00000000(
    int                        CUP$parser$act_num,
    java_cup.runtime.lr_parser CUP$parser$parser,
    java.util.Stack            CUP$parser$stack,
    int                        CUP$parser$top)
    throws java.lang.Exception
    {
      /* Symbol object for return from actions */
      java_cup.runtime.Symbol CUP$parser$result;

      /* select the action based on the action number */
      switch (CUP$parser$act_num)
        {
          /*. . . . . . . . . . . . . . . . . . . .*/
          case 0: // $START ::= PROG EOF 
            { 
              Object RESULT =null;
		int start_valleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int start_valright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Object start_val = (Object)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		RESULT = start_val;
              CUP$parser$result = parser.getSymbolFactory().newSymbol("$START",0, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          /* ACCEPT */
          CUP$parser$parser.done_parsing();
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 1: // PROG ::= header_sec SEP warehouse_sec SEP products_sec 
            { parser.Tree.reduce(5,"PROG",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("PROG",0, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 2: // header_sec ::= tok1_even tok2_3 
            { parser.Tree.reduce(2,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 3: // header_sec ::= tok1_even tok2_9 
            { parser.Tree.reduce(2,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 4: // header_sec ::= tok1_even tok2_12 
            { parser.Tree.reduce(2,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 5: // header_sec ::= TK2 S tok1_maybe TK2 S tok1_maybe 
            { parser.Tree.reduce(6,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-5)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 6: // header_sec ::= TK2 S tok1_maybe TK2 S tok1_maybe TK2 S tok1_maybe 
            { parser.Tree.reduce(9,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-8)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 7: // tok1_even ::= TK1 S TK1 S TK1 S TK1 S 
            { parser.Tree.reduce(8,"tok1_even",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_even",3, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-7)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 8: // tok1_even ::= tok1_even TK1 S TK1 S 
            { parser.Tree.reduce(5,"tok1_even",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_even",3, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 9: // tok2_3 ::= TK2 S TK2 S TK2 S 
            { parser.Tree.reduce(6,"tok2_3",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok2_3",4, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-5)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 10: // tok2_9 ::= tok2_3 tok2_3 tok2_3 
            { parser.Tree.reduce(3,"tok2_9",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok2_9",5, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 11: // tok2_12 ::= tok2_3 tok2_3 tok2_3 tok2_3 
            { parser.Tree.reduce(4,"tok2_12",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok2_12",6, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 12: // tok1_maybe ::= tok1_maybe TK1 S 
            { parser.Tree.reduce(3,"tok1_maybe",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_maybe",7, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 13: // tok1_maybe ::= 
            { parser.Tree.reduce(0,"tok1_maybe",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_maybe",7, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 14: // warehouse_sec ::= material_type material_type 
            { parser.Tree.reduce(2,"warehouse_sec",0);
              Object RESULT =null;
		
                   for(String s1 : table.keySet()){
                    HashMap<String, Double> materials = table.get(s1);

                    double minPrice = Double.MAX_VALUE;
                    double maxPrice = Double.MIN_VALUE;
                    String min = "";
                    String max = "";
                    for(String s2 : materials.keySet()){
                        double price = materials.get(s2);
                        if(price<minPrice){
                            minPrice = price;
                            min = s2;
                        }
                        if(price>maxPrice){
                            maxPrice = price;
                            max=s2;
                        }
                    }
                    System.out.println(s1+": less: "+min+", more: "+max);
                   }
                    System.out.println("---");
                
              CUP$parser$result = parser.getSymbolFactory().newSymbol("warehouse_sec",2, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 15: // warehouse_sec ::= warehouse_sec material_type material_type 
            { parser.Tree.reduce(3,"warehouse_sec",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("warehouse_sec",2, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 16: // material_type ::= BO material_l BC QSTRING S 
            { parser.Tree.reduce(5,"material_type",0);
              Object RESULT =null;
		int tableft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).left;
		int tabright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).right;
		HashMap<String,Double> tab = (HashMap<String,Double>)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-3)).value;
		int mat_type_nameleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int mat_type_nameright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		String mat_type_name = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
                    parser.table.put(mat_type_name,tab);
                  
              CUP$parser$result = parser.getSymbolFactory().newSymbol("material_type",8, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 17: // material_l ::= material_l CM QSTRING REAL EURO_KG 
            { parser.Tree.reduce(5,"material_l",0);
              HashMap<String,Double> RESULT =null;
		int tableft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)).left;
		int tabright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)).right;
		HashMap<String,Double> tab = (HashMap<String,Double>)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-4)).value;
		int mat_nameleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int mat_nameright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		String mat_name = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int priceleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int priceright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Double price = (Double)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
                   tab.put(mat_name, price);
                   RESULT = tab;
               
              CUP$parser$result = parser.getSymbolFactory().newSymbol("material_l",12, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 18: // material_l ::= QSTRING REAL EURO_KG 
            { parser.Tree.reduce(3,"material_l",0);
              HashMap<String,Double> RESULT =null;
		int mat_nameleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int mat_nameright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		String mat_name = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int priceleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int priceright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Double price = (Double)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
                   RESULT = new HashMap<String,Double>();
                   RESULT.put(mat_name, price);
               
              CUP$parser$result = parser.getSymbolFactory().newSymbol("material_l",12, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 19: // products_sec ::= products_sec product 
            { parser.Tree.reduce(2,"products_sec",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("products_sec",9, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 20: // products_sec ::= 
            { parser.Tree.reduce(0,"products_sec",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("products_sec",9, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 21: // NT$0 ::= 
            { parser.Tree.reduce(0,"NT$0",0);
              Object RESULT =null;
		int prod_nameleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int prod_nameright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		String prod_name = (String)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
System.out.println(prod_name);
              CUP$parser$result = parser.getSymbolFactory().newSymbol("NT$0",18, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 22: // product ::= REAL EURO QSTRING NT$0 COL elements_l S 
            { parser.Tree.reduce(7,"product",0);
              Object RESULT =null;
              // propagate RESULT from NT$0
                RESULT = (Object) ((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-3)).value;
		int prod_nameleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)).left;
		int prod_nameright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-4)).right;
		String prod_name = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-4)).value;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("product",10, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-6)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 23: // NT0 ::= 
            { parser.Tree.reduce(0,"NT0",0);
              Double RESULT =null;
		 RESULT = (Double) parser.stack(-6); 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("NT0",15, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 24: // NT1 ::= 
            { parser.Tree.reduce(0,"NT1",0);
              Double RESULT =null;
		 RESULT = (Double) parser.stack(-4); 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("NT1",16, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 25: // elements_l ::= elements_l CM NT0 element 
            { parser.Tree.reduce(4,"elements_l",0);
              Double RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("elements_l",14, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 26: // elements_l ::= NT1 element 
            { parser.Tree.reduce(2,"elements_l",0);
              Double RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("elements_l",14, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 27: // element ::= QSTRING BO components_l BC 
            { parser.Tree.reduce(4,"element",0);
              String RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).right;
		String x = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-3)).value;
		int priceleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int priceright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Object price = (Object)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
       RESULT = x;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("element",17, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 28: // components_l ::= components_l CM component 
            { parser.Tree.reduce(3,"components_l",0);
              Object RESULT =null;
		int statleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int statright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		Object stat = (Object)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int rleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int rright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Object[] r = (Object[])((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		
                    String name = (String) parser.stack(-4);
                    HashMap<String, Double> map = parser.table.get(name);
                    Double price = map.get(r[0].toString());
                    Double weight = Double.parseDouble(r[1].toString());
                    Double result = weight * price;
                    Double price_add = (Double) parser.stack(-5);
                    System.out.println(r[0] + " "+(result.doubleValue()+price_add.doubleValue())+" euro");
                
              CUP$parser$result = parser.getSymbolFactory().newSymbol("components_l",11, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 29: // components_l ::= component 
            { parser.Tree.reduce(1,"components_l",0);
              Object RESULT =null;
		int rleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int rright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Object[] r = (Object[])((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		
                    String name = (String) parser.stack(-2);
                    HashMap<String, Double> map = parser.table.get(name);
                    Double price = map.get(r[0].toString());
                    Double weight = Double.parseDouble(r[1].toString());
                    Double result = weight * price;
                    Double price_add = (Double) parser.stack(-3);
                    System.out.println(r[0] + " "+(result.doubleValue()+price_add.doubleValue())+" euro");
                
              CUP$parser$result = parser.getSymbolFactory().newSymbol("components_l",11, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 30: // component ::= QSTRING UINT KG 
            { parser.Tree.reduce(3,"component",0);
              Object[] RESULT =null;
		int comp_nameleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int comp_nameright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		String comp_name = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int weightleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int weightright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Integer weight = (Integer)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
    RESULT = new Object[2];
    RESULT[0] = comp_name;
    RESULT[1] = weight;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("component",13, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /* . . . . . .*/
          default:
            throw new Exception(
               "Invalid action number "+CUP$parser$act_num+"found in internal parse table");

        }
    } /* end of method */

  /** Method splitting the generated action code into several parts. */
  public final java_cup.runtime.Symbol CUP$parser$do_action(
    int                        CUP$parser$act_num,
    java_cup.runtime.lr_parser CUP$parser$parser,
    java.util.Stack            CUP$parser$stack,
    int                        CUP$parser$top)
    throws java.lang.Exception
    {
              return CUP$parser$do_action_part00000000(
                               CUP$parser$act_num,
                               CUP$parser$parser,
                               CUP$parser$stack,
                               CUP$parser$top);
    }
}

}