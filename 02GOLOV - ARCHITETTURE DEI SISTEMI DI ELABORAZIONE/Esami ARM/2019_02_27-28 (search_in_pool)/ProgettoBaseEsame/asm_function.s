                AREA myData, DATA, READONLY
pool            DCD 0x01, 0x02, 0x03  

                AREA asm_function, CODE, READONLY				
			    EXPORT search_in_pool 

ELEMENTS EQU 3
				; save current SP for a faster access to parameters in the stack
search_in_pool  MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
			
                LDR r1, =pool			
				MOV r4, #0   ; i
				MOV R5, #-1
				
ciclo           LDR r2, [r1, r4, lsl #2]
			    cmp r0,r2
				add r4, r4, #1
				moveq r5, r4
				cmp r4, #ELEMENTS
				beq fine
				b ciclo
				
				
				; restore volatile registers
fine		    MOV R0, R5
                LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END