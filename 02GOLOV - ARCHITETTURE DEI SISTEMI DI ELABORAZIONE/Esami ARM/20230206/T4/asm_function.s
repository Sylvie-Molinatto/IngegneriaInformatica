
		                                    AREA asm_function, CODE, READONLY				
				                            EXPORT media_e_superiori_alla_media
				
				                            ; save current SP for a faster access to parameters in the stack
media_e_superiori_alla_media				MOV   r12, sp
				                            ; save volatile registers
				                            STMFD sp!,{r4-r8,r10-r11,lr}				
			
			                                ;R0 VETT
											;R1 posizione
											;R2 super
											
											MOV R3, #0 ;indice i
											MOV R5, #0
											
loop_media                                  LDRB R4, [R0, R3]
                                            ADD R5, R5, R4
											ADD R3, R3, #1
											CMP R3, R1
											BLO loop_media
											
											UDIV R5, R5, R3 ; media
											MOV R3, #0
											MOV R6, #0
											
loop_sup_media                              LDRB R4, [R0, R3]
                                            CMP R4, R5
											ADDGT R6, R6, #1
											ADD R3, R3, #1
											CMP R3, R1
											BLO loop_sup_media
											
											MOV R0, R5
											STRB R6, [R2]
			
				                            ; restore volatile registers
fine		                                LDMFD sp!,{r4-r8,r10-r11,pc}
				
                                            END