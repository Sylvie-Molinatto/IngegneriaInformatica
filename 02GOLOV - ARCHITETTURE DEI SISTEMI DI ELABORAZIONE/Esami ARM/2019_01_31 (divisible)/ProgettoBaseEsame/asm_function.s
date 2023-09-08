
		        AREA asm_function, CODE, READONLY				
				EXPORT divisible
				
				; save current SP for a faster access to parameters in the stack
divisible	    MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
			
ciclo			cmp r0, r1
                subsge r0, r0, r1
				bgt ciclo
                
			    
				; restore volatile registers
fine		    LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END