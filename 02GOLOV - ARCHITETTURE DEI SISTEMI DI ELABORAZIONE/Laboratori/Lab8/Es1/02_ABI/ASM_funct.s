				
				
				AREA asm_functions, CODE, READONLY				
				IMPORT __aeabi_fdiv
					
check_square    PROC
	            EXPORT check_square
					
                ;save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}
				
				MUL r0, r0, r0 ; x^2
				MUL r1, r1, r1 ; y^2
				MUL r2, r2, r2 ; r^2
				ADD r4, r0, r1 ; x^2+y^2
				CMP r4,r2
				MOVLE r0,#1
				MOVGT r0,#0
				
				; restore volatile registers
				LDMFD sp!,{r4-r8,r10-r11,pc}
				
				ENDP
				
my_division     PROC
	            EXPORT my_division
					
                STMFD sp!, {r4-r7,lr}
				
				LDR r0, [r0] ; *a
				LDR r1, [r1] ; *b
				
				BL __aeabi_fdiv
				
				LDMFD sp!,{r4-r7,pc}
				
				ENDP
				
				
                END