/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_RIT.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    RIT.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "RIT.h"
#include "../led/led.h"
#include "../timer/timer.h"


/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

#define N 5

extern int ASM_monotono(volatile unsigned char *, unsigned int);

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;

volatile int stato = 0;
volatile unsigned char  VETT[N]={0};
volatile unsigned char VAR =0;
volatile unsigned int indice = 0;


void RIT_IRQHandler (void)
{	
	int i,res;	
	if(down_0!=0){  
			down_0 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){

			switch(down_0){
			case 2:
				if(stato ==2 ){
					reset_timer(1);
					enable_timer(1);
					indice = 0;
					VAR = 0;
					stato = 0;
					for(i=0; i<N;i++){
						VETT[i] = 0;
					}
				}
					
				
			
			
				break;
			default:
				break;
		}
	}
	else {	/* button released */
		down_0=0;			
		NVIC_EnableIRQ(EINT0_IRQn);							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 20);     /* External interrupt 0 pin selection */
	}
	}	
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){

			switch(down_1){
			case 2:
				if (stato == 0){
					stato = 1;
				}else if(stato == 1){
					res = ASM_monotono(VETT, indice);// ASM
					stato = 2;
					disable_timer(1);
					LED_Out(res);
					// mostra risultati
				}
			
				break;
			default:
				break;
		}
	}
	else {	/* button released */
		down_1=0;			
		NVIC_EnableIRQ(EINT1_IRQn);							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
	}
	}
	if(down_2!=0){  
			down_2 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<12)) == 0){
			switch(down_2){
			case 2:
				if(stato == 1){
				  VETT[indice] = VAR;
					indice++;
					stato = 0;
					if(indice == N){
					  res = ASM_monotono(VETT, indice); // ASM
						stato = 2;
						disable_timer(1);
						LED_Out(res); 	// mostra risultati
					}
				
				}
			
				break;
			default:
			
				break;
		}
	}
	else {	/* button released */
		down_2=0;			
		NVIC_EnableIRQ(EINT2_IRQn); 							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 24);     /* External interrupt 0 pin selection */
	}
	}
		
	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
