VETT    RN 0    
dim     RN 1
size    RN 2
value   RN 3
offset  RN 4
somma   RN 5
media   RN 6
counter RN 7
		        AREA asm_function, CODE, READONLY				
                EXPORT  sopra_la_media
					
sopra_la_media
				; save current SP for a faster access 
				; to parameters in the stack
				MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
				MOV size, #1
				MOV offset, #0
				MOV somma, #0
				MOV media, #0
				mov counter, #0
				MUL dim, dim, size
				
calcola_media   LDRB value, [VETT,offset]
                ADD somma, somma, value
				ADD offset, offset, size
				cmp offset, dim
				bne calcola_media
				
				mov offset, #0
				udiv media, somma, dim
				
conta           LDRB value, [VETT,offset]	
				cmp value, media
				addgt counter, counter, #1
				ADD offset, offset, size
				cmp offset, dim
				bne conta
				
				mov r0, counter
				; restore volatile registers
fine		    LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END