
		                         AREA asm_function, CODE, READONLY				
				                 EXPORT totale_pressioni_con_filtro
				
				                 ; save current SP for a faster access to parameters in the stack
totale_pressioni_con_filtro	     MOV   r12, sp
				                 ; save volatile registers
				                 STMFD sp!,{r4-r8,r10-r11,lr}				
			
			                     ; R0 VETT[]
								 ; R1 posizione
								 ; R2 MAX
								 ; R3 MIN
								 
								 MOV R4, #0 ; contatore
								 MOV R6, #0 ; risultato

ciclo                            LDRB R5, [R0, R4]
                                 CMP R5, R2
								 BGT next
								 CMP R5, R3
								 BLT next
								 ADD R6, R6, R5
								 
next                             ADD R4, R4, #1
                                 CMP R4, R1
								 BLT ciclo
			
				                 ; restore volatile registers
fine		                     MOV R0, R6
                                 LDMFD sp!,{r4-r8,r10-r11,pc}
				
                                 END