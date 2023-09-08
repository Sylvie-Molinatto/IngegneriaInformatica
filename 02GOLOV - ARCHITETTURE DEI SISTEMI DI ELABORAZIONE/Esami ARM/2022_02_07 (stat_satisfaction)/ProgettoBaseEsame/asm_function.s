PS RN 8
PI RN 9
PN RN 10


		                   AREA asm_function, CODE, READONLY				
				           EXPORT stat_satisfaction
				
				           ; save current SP for a faster access to parameters in the stack
stat_satisfaction	       MOV   r12, sp
				           ; save volatile registers
				           STMFD sp!,{r4-r8,r10-r11,lr}				
			               ; R0 Soddisfatti, R1 Neutri, R2 Insoddisfatti

                           LDR R4, [r12]
						   LDR R5, [R12, #4]
                           MOV R11, #100
							
                           ADD R7, R0, R1
						   ADD R7, R7, R2
						   
						   MUL PS, R0, R11
						   UDIV PS, PS, R7
						   STRB PS, [R3]
						   
						   MUL PN, R1, R11
						   UDIV PN, PN, R7
						   STR PN, [R4]
						   
						   MUL PI, R2, R11
						   UDIV PI, PI, R7
						   STR PI, [R5]
			
				           ; restore volatile registers
fine		               MOV R0, R7
                           LDMFD sp!,{r4-r8,r10-r11,pc}
				
                           END