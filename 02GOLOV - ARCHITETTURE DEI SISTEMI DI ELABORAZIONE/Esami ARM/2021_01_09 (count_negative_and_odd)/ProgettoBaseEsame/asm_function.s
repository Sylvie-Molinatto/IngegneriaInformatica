VETT     RN 0
N        RN 1 
offset   RN 2 
size     RN 3 
value    RN 4 
counter  RN 5 
pointer  RN 6
		                    AREA asm_function, CODE, READONLY				
				            EXPORT count_negative_and_odd
				
				            ; save current SP for a faster access to parameters in the stack
count_negative_and_odd	    MOV   r12, sp
				            ; save volatile registers
				            STMFD sp!,{r4-r8,r10-r11,lr}				
							MOV offset, #0
							MOV size, #4
							MUL N, size, N
							MOV counter, #0
							MOV pointer, #0
							MOV r8, #1
			
ciclo                       LDR value, [VETT, offset]
                            SUBS value, value, #0
							bpl controllo
							TST r8, value
							ADDNE counter, counter, #1
							;b controllo
							;lsl r7, value, #28
							;lsr r7, r7, #28
                            ;cmp r7, #0x01
							;addeq counter, counter, #1
                            ;beq controllo
							;cmp r7, #0x03
							;addeq counter, counter, #1
                            ;beq controllo
							;cmp r7, #0x05
							;addeq counter, counter, #1
                            ;beq controllo
							;cmp r7, #0x07
							;addeq counter, counter, #1
                            ;beq controllo
							;cmp r7, #0x09
							;addeq counter, counter, #1
                            ;beq controllo
							;cmp r7, #0x0B
							;addeq counter, counter, #1
                            ;beq controllo
							;cmp r7, #0x0D
							;addeq counter, counter, #1
							;cmp r7, #0x0F
							;addeq counter, counter, #1
							;b controllo
							
							
controllo                   add offset, offset, size
                            cmp offset, N
							ble ciclo						
							
							
				            
fine		                MOV R0, counter
                            ; restore volatile registers
                            LDMFD sp!,{r4-r8,r10-r11,pc}
				
                            END