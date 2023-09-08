  AREA morse, DATA, READONLY

MORSE_TABLE   DCD 0xFFFFFF01, 0xFFFF1000, 0xFFFF1010, 0xFFFFF100, 0xFFFFFFF0, 0xFFFF0010
              DCD 0xFFFFF110, 0xFFFF0000, 0xFFFFFF00, 0xFFFF0111, 0xFFFFF101, 0xFFFF0100
			  DCD 0xFFFFFF11, 0xFFFFFF10, 0xFFFFF111, 0xFFFF0110, 0xFFFF1101, 0xFFFFF010
			  DCD 0xFFFFF000, 0xFFFFFFF1, 0xFFFFF001, 0xFFFF0001, 0xFFFFF011, 0xFFFF1001
			  DCD 0xFFFF1011, 0xFFFF1100, 0xFFF01111, 0xFFF00111, 0xFFF00011, 0XFFF00001
			  DCD 0xFFF00000, 0xFFF10000, 0XFFF11000, 0xFFF11100, 0xFFF11110, 0XFFF11111

CONVERSION_TABLE DCB "A", "B", "C", "D", "E", "F", "G", "H", "I"
                 DCB "J", "K", "L", "M", "N", "O", "P", "Q", "R"
				 DCB "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
				 DCB "2", "3", "4", "5", "6", "7", "8", "9", "0"
	
	 AREA asm_functions, CODE, READONLY
		 
  
translate_morse    PROC
	               EXPORT translate_morse
	               MOV R12, SP
			       STMFD SP!, {R1-R12, LR}
			
				   MOV  R3, #0
			       LDR  R4, [R12], #4    ; separator
			       LDR  R5, [R12], #4    ; space
			       LDR  R6, [R12]        ; end
				   MOV  r8, #0           ; i
                   MOV  r9, r1           ; input_vector length
			
loop    	       MOV  R7, #0xFFFFFFFF
			
next		       ADD r8, r8, #1
                   CMP r8,r9
				   BGT exit
                   LDRB R1, [R0], #1
                   CMP R1, #0x30   ;is 0?
			       BNE equal_1
			       LSL R7, R7, #4
			       EOR R7, #0
			       B next

equal_1            CMP R1, #0x31   ; is 1?
                   BNE is_terminator
			       LSL R7, R7, #4
			       EOR R7, #1
			       B next
			
is_terminator      CMP R1, R6      ; is end?
                   BNE is_separator
			       BL find_match
			       STRB r7, [r2], #1
			       ADD R3, R3, #1
				   MOV R0, R3
			       B exit
			  
is_separator       CMP R1, R4      ; is separator?
                   BNE is_space
			       BL find_match
			       STRB r7, [r2], #1
			       ADD R3, R3, #1
			       B loop

is_space           CMP R1, R5    ; is space?
			       BL find_match
			       STRB r7, [r2], #1
			       MOV r7, #0x20
			       STRB r7, [r2], #1
			       ADD R3, R3, #2
			       B loop
			       

exit 			   LDMFD sp!,{R1-R12, PC}
                   ENDP
			   
find_match         PROC
	               STMFD SP!, {R0-R6, R8-R12, LR}
			       MOV R0,R7
			       LDR R1, =MORSE_TABLE
			       LDR R3, =CONVERSION_TABLE
			  
loop_2             LDR R2, [R1], #4
                   LDRB R4, [R3], #1
			       CMP R0, R2
			       BNE loop_2
			       MOV R7, R4
			   
			       LDMFD SP!, {R0-R6, R8-R12, PC}
			       ENDP
				   
			       END
			
			