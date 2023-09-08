 AREA asm_functions, CODE, READONLY
		 
  
ASM_monotono   PROC
	           EXPORT ASM_monotono

			   MOV r12, sp
			   ; save volatile registers
			   STMFD sp!, {r4-r8, r10-r11, lr}
			   mov r2, #0xff ; result value
			   mov r3, #0 ; pointer
			   mov r4, #0 ; reference

ciclo          ldrb r5, [r0,r3]
               cmp r5,r4
			   movlo r2, #0x55;
			   mov r4,r5
			   add r3,r3,#1
			   cmp r3,r1
			   blo ciclo
			   
			   mov r0,r2
			   ; restore volatile registers
			   LDMFD sp!,{r4-r8, r10-r11, pc}
               ENDP
			   END