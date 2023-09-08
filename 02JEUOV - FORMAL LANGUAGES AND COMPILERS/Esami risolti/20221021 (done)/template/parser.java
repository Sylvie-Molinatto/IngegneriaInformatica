
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
    "\000\035\000\002\002\004\000\002\002\005\000\002\003" +
    "\003\000\002\003\006\000\002\003\017\000\002\004\005" +
    "\000\002\004\005\000\002\004\002\000\002\005\005\000" +
    "\002\005\002\000\002\010\005\000\002\010\004\000\002" +
    "\013\006\000\002\013\005\000\002\006\004\000\002\006" +
    "\005\000\002\014\002\000\002\015\002\000\002\007\013" +
    "\000\002\011\005\000\002\011\005\000\002\011\004\000" +
    "\002\011\005\000\002\011\003\000\002\011\003\000\002" +
    "\011\003\000\002\011\006\000\002\012\005\000\002\012" +
    "\003" });

  /** Access to production table. */
  public short[][] production_table() {return _production_table;}

  /** Parse-action table. */
  protected static final short[][] _action_table = 
    unpackFromStrings(new String[] {
    "\000\105\000\012\004\ufffa\005\ufffa\006\ufffa\010\ufffa\001" +
    "\002\000\012\004\072\005\071\006\070\010\uffff\001\002" +
    "\000\004\002\067\001\002\000\004\010\007\001\002\000" +
    "\010\002\ufff8\012\011\030\010\001\002\000\004\011\064" +
    "\001\002\000\016\017\030\023\025\024\023\025\027\026" +
    "\024\030\022\001\002\000\006\012\011\030\010\001\002" +
    "\000\004\002\000\001\002\000\006\012\011\030\010\001" +
    "\002\000\010\002\ufff9\012\011\030\010\001\002\000\006" +
    "\012\011\030\010\001\002\000\010\002\ufff6\012\ufff6\030" +
    "\ufff6\001\002\000\006\012\011\030\010\001\002\000\010" +
    "\002\ufff7\012\ufff7\030\ufff7\001\002\000\020\007\uffe8\013" +
    "\uffe8\014\uffe8\020\uffe8\021\uffe8\022\uffe8\027\uffe8\001\002" +
    "\000\020\007\uffea\013\uffea\014\uffea\020\uffea\021\uffea\022" +
    "\uffea\027\uffea\001\002\000\004\017\056\001\002\000\016" +
    "\017\030\023\025\024\023\025\027\026\024\030\022\001" +
    "\002\000\010\013\ufff1\021\032\022\034\001\002\000\020" +
    "\007\uffe9\013\uffe9\014\uffe9\020\uffe9\021\uffe9\022\uffe9\027" +
    "\uffe9\001\002\000\016\017\030\023\025\024\023\025\027" +
    "\026\024\030\022\001\002\000\010\020\033\021\032\022" +
    "\034\001\002\000\016\017\030\023\025\024\023\025\027" +
    "\026\024\030\022\001\002\000\020\007\uffeb\013\uffeb\014" +
    "\uffeb\020\uffeb\021\uffeb\022\uffeb\027\uffeb\001\002\000\016" +
    "\017\030\023\025\024\023\025\027\026\024\030\022\001" +
    "\002\000\020\007\uffed\013\uffed\014\uffed\020\uffed\021\uffed" +
    "\022\uffed\027\uffed\001\002\000\020\007\uffee\013\uffee\014" +
    "\uffee\020\uffee\021\uffee\022\uffee\027\uffee\001\002\000\012" +
    "\002\ufff4\012\ufff4\013\ufff0\030\ufff4\001\002\000\004\013" +
    "\042\001\002\000\012\002\ufff3\012\ufff3\013\ufff3\030\ufff3" +
    "\001\002\000\016\017\030\023\025\024\023\025\027\026" +
    "\024\030\022\001\002\000\010\014\044\021\032\022\034" +
    "\001\002\000\004\016\045\001\002\000\004\017\046\001" +
    "\002\000\004\031\047\001\002\000\004\020\050\001\002" +
    "\000\004\007\051\001\002\000\004\015\052\001\002\000" +
    "\012\002\uffef\012\uffef\013\uffef\030\uffef\001\002\000\004" +
    "\013\042\001\002\000\012\002\ufff2\012\ufff2\013\ufff2\030" +
    "\ufff2\001\002\000\020\007\uffec\013\uffec\014\uffec\020\uffec" +
    "\021\uffec\022\uffec\027\uffec\001\002\000\016\017\030\023" +
    "\025\024\023\025\027\026\024\030\022\001\002\000\006" +
    "\020\062\027\061\001\002\000\012\020\uffe5\021\032\022" +
    "\034\027\uffe5\001\002\000\016\017\030\023\025\024\023" +
    "\025\027\026\024\030\022\001\002\000\020\007\uffe7\013" +
    "\uffe7\014\uffe7\020\uffe7\021\uffe7\022\uffe7\027\uffe7\001\002" +
    "\000\012\020\uffe6\021\032\022\034\027\uffe6\001\002\000" +
    "\016\017\030\023\025\024\023\025\027\026\024\030\022" +
    "\001\002\000\010\007\066\021\032\022\034\001\002\000" +
    "\010\002\ufff5\012\ufff5\030\ufff5\001\002\000\004\002\001" +
    "\001\002\000\004\007\107\001\002\000\004\007\074\001" +
    "\002\000\004\007\073\001\002\000\012\004\ufffc\005\ufffc" +
    "\006\ufffc\010\ufffc\001\002\000\012\004\ufffa\005\ufffa\006" +
    "\ufffa\010\ufffa\001\002\000\012\004\072\005\076\006\070" +
    "\010\ufffe\001\002\000\004\007\077\001\002\000\010\004" +
    "\ufffa\005\ufffa\006\ufffa\001\002\000\010\004\072\005\101" +
    "\006\070\001\002\000\004\007\102\001\002\000\010\004" +
    "\ufffa\005\ufffa\006\ufffa\001\002\000\010\004\072\005\104" +
    "\006\070\001\002\000\004\007\105\001\002\000\010\004" +
    "\ufffa\006\ufffa\010\ufffa\001\002\000\010\004\072\006\070" +
    "\010\ufffd\001\002\000\012\004\ufffb\005\ufffb\006\ufffb\010" +
    "\ufffb\001\002" });

  /** Access to parse-action table. */
  public short[][] action_table() {return _action_table;}

  /** <code>reduce_goto</code> table. */
  protected static final short[][] _reduce_table = 
    unpackFromStrings(new String[] {
    "\000\105\000\010\002\004\003\005\004\003\001\001\000" +
    "\002\001\001\000\002\001\001\000\002\001\001\000\006" +
    "\005\012\013\011\001\001\000\002\001\001\000\004\011" +
    "\025\001\001\000\004\013\013\001\001\000\002\001\001" +
    "\000\006\010\014\013\015\001\001\000\004\013\017\001" +
    "\001\000\004\013\016\001\001\000\002\001\001\000\004" +
    "\013\020\001\001\000\002\001\001\000\002\001\001\000" +
    "\002\001\001\000\002\001\001\000\004\011\054\001\001" +
    "\000\006\006\036\014\037\001\001\000\002\001\001\000" +
    "\004\011\030\001\001\000\002\001\001\000\004\011\035" +
    "\001\001\000\002\001\001\000\004\011\034\001\001\000" +
    "\002\001\001\000\002\001\001\000\004\015\052\001\001" +
    "\000\004\007\040\001\001\000\002\001\001\000\004\011" +
    "\042\001\001\000\002\001\001\000\002\001\001\000\002" +
    "\001\001\000\002\001\001\000\002\001\001\000\002\001" +
    "\001\000\002\001\001\000\002\001\001\000\004\007\053" +
    "\001\001\000\002\001\001\000\002\001\001\000\006\011" +
    "\057\012\056\001\001\000\002\001\001\000\002\001\001" +
    "\000\004\011\062\001\001\000\002\001\001\000\002\001" +
    "\001\000\004\011\064\001\001\000\002\001\001\000\002" +
    "\001\001\000\002\001\001\000\002\001\001\000\002\001" +
    "\001\000\002\001\001\000\002\001\001\000\004\004\074" +
    "\001\001\000\002\001\001\000\002\001\001\000\004\004" +
    "\077\001\001\000\002\001\001\000\002\001\001\000\004" +
    "\004\102\001\001\000\002\001\001\000\002\001\001\000" +
    "\004\004\105\001\001\000\002\001\001\000\002\001\001" +
    "" });

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

    table = new HashMap<String, Boolean>();

 Tree = new DisegnaAlbero();   }public static DisegnaAlbero Tree;

  /** Scan to get the next Symbol. */
  public java_cup.runtime.Symbol scan()
    throws java.lang.Exception
    {
 Symbol s=_scanner.next_token(); Tree.push(s.toString(), 0); return s;   }


    public HashMap<String, Boolean> table;

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
          case 1: // PROG ::= header_sec SEP command_sec 
            { parser.Tree.reduce(3,"PROG",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("PROG",0, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 2: // header_sec ::= tok1_tok3_maybe 
            { parser.Tree.reduce(1,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 3: // header_sec ::= tok1_tok3_maybe TK2 S tok1_tok3_maybe 
            { parser.Tree.reduce(4,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 4: // header_sec ::= tok1_tok3_maybe TK2 S tok1_tok3_maybe TK2 S tok1_tok3_maybe TK2 S tok1_tok3_maybe TK2 S tok1_tok3_maybe 
            { parser.Tree.reduce(13,"header_sec",1);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("header_sec",1, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-12)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 5: // tok1_tok3_maybe ::= tok1_tok3_maybe TK1 S 
            { parser.Tree.reduce(3,"tok1_tok3_maybe",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_tok3_maybe",2, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 6: // tok1_tok3_maybe ::= tok1_tok3_maybe TK3 S 
            { parser.Tree.reduce(3,"tok1_tok3_maybe",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_tok3_maybe",2, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 7: // tok1_tok3_maybe ::= 
            { parser.Tree.reduce(0,"tok1_tok3_maybe",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("tok1_tok3_maybe",2, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 8: // command_sec ::= cmd cmd more_command 
            { parser.Tree.reduce(3,"command_sec",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("command_sec",3, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 9: // command_sec ::= 
            { parser.Tree.reduce(0,"command_sec",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("command_sec",3, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 10: // more_command ::= more_command cmd cmd 
            { parser.Tree.reduce(3,"more_command",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("more_command",6, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 11: // more_command ::= cmd cmd 
            { parser.Tree.reduce(2,"more_command",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("more_command",6, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 12: // cmd ::= ID EQ bool_expr S 
            { parser.Tree.reduce(4,"cmd",0);
              Boolean RESULT =null;
		int idleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).left;
		int idright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).right;
		String id = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-3)).value;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
           parser.table.put(id, x);
           if(x==true){
             System.out.println(id+" T");
           }
           else{
            System.out.println(id+" F");
           }
          
        
              CUP$parser$result = parser.getSymbolFactory().newSymbol("cmd",9, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 13: // cmd ::= CMP bool_expr action_l 
            { parser.Tree.reduce(3,"cmd",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		
              RESULT = x;
        
              CUP$parser$result = parser.getSymbolFactory().newSymbol("cmd",9, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 14: // action_l ::= NT0 action_instr 
            { parser.Tree.reduce(2,"action_l",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("action_l",4, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 15: // action_l ::= action_l NT1 action_instr 
            { parser.Tree.reduce(3,"action_l",0);
              Object RESULT =null;

              CUP$parser$result = parser.getSymbolFactory().newSymbol("action_l",4, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 16: // NT0 ::= 
            { parser.Tree.reduce(0,"NT0",0);
              Boolean RESULT =null;
		 RESULT = (Boolean) parser.stack(0); 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("NT0",10, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 17: // NT1 ::= 
            { parser.Tree.reduce(0,"NT1",0);
              Boolean RESULT =null;
		 RESULT = (Boolean) parser.stack(-1); 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("NT1",11, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 18: // action_instr ::= WITH bool_expr SO PRINT RO QSTRING RC S SC 
            { parser.Tree.reduce(9,"action_instr",0);
              Object RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-7)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-7)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-7)).value;
		int qleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).left;
		int qright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)).right;
		String q = (String)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-3)).value;
		
                    Boolean prev = (Boolean) parser.stack(-9);
                    if(prev==x){
                        System.out.println(q);
                    }
             
              CUP$parser$result = parser.getSymbolFactory().newSymbol("action_instr",5, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-8)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 19: // bool_expr ::= bool_expr AND bool_expr 
            { parser.Tree.reduce(3,"bool_expr",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int yleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int yright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Boolean y = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		 RESULT = x&y; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 20: // bool_expr ::= bool_expr OR bool_expr 
            { parser.Tree.reduce(3,"bool_expr",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int yleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int yright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Boolean y = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		 RESULT = x|y; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 21: // bool_expr ::= NOT bool_expr 
            { parser.Tree.reduce(2,"bool_expr",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		 RESULT = !x; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 22: // bool_expr ::= RO bool_expr RC 
            { parser.Tree.reduce(3,"bool_expr",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		 RESULT = x; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 23: // bool_expr ::= T 
            { parser.Tree.reduce(1,"bool_expr",0);
              Boolean RESULT =null;
		 RESULT = true; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 24: // bool_expr ::= F 
            { parser.Tree.reduce(1,"bool_expr",0);
              Boolean RESULT =null;
		 RESULT = false; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 25: // bool_expr ::= ID 
            { parser.Tree.reduce(1,"bool_expr",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		String x = (String)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		 RESULT = parser.table.get(x); 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 26: // bool_expr ::= FZFUNCTION RO bool_expr_l RC 
            { parser.Tree.reduce(4,"bool_expr",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-1)).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-1)).value;
		 RESULT = x; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr",7, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-3)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 27: // bool_expr_l ::= bool_expr_l CM bool_expr 
            { parser.Tree.reduce(3,"bool_expr_l",0);
              Boolean RESULT =null;
		int prevleft = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).left;
		int prevright = ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)).right;
		Boolean prev = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.elementAt(CUP$parser$top-2)).value;
		int currentleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int currentright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Boolean current = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		
                     if(current==false){
                        RESULT = false;
                     }
                     else {
                        RESULT = true;
                     }
              
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr_l",8, ((java_cup.runtime.Symbol)CUP$parser$stack.elementAt(CUP$parser$top-2)), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
            }
          return CUP$parser$result;

          /*. . . . . . . . . . . . . . . . . . . .*/
          case 28: // bool_expr_l ::= bool_expr 
            { parser.Tree.reduce(1,"bool_expr_l",0);
              Boolean RESULT =null;
		int xleft = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).left;
		int xright = ((java_cup.runtime.Symbol)CUP$parser$stack.peek()).right;
		Boolean x = (Boolean)((java_cup.runtime.Symbol) CUP$parser$stack.peek()).value;
		 RESULT = x; 
              CUP$parser$result = parser.getSymbolFactory().newSymbol("bool_expr_l",8, ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), ((java_cup.runtime.Symbol)CUP$parser$stack.peek()), RESULT);
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
