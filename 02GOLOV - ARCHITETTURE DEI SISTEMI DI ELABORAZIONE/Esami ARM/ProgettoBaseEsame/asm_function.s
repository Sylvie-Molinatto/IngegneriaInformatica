
		        AREA asm_function, CODE, READONLY				
				; EXPORT function_name
				
				; save current SP for a faster access to parameters in the stack
				MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
			
			
			
				; restore volatile registers
fine		    LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END