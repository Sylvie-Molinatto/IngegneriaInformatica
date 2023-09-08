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
#define N 10

extern unsigned int sopra_la_media(unsigned char VETT[], unsigned int n); 
volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_select = 0;
volatile int J_up = 0;
volatile int J_left = 0;
volatile unsigned char VAR = 0;
unsigned char VETT[N] = {0};
int sequenza=0;

void RIT_IRQHandler (void)
{		
	static unsigned char posizione = 0;
	unsigned int result;
	static int asm_done=0;
	static int i;
	
	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	
		/* Joytick Select pressed p1.25*/
		/* Joytick Down pressed p1.26 --> using J_DOWN due to emulator issues*/
		
		J_up++;
		switch(J_up){
			case 0x0A:
					VAR++;
			    LED_Out(VAR);
				break;
			default:
				break;
		}
	}
	else{
			J_up=0;
	}
	
	if((LPC_GPIO1->FIOPIN & (1<<27)) == 0){	
		/* Joytick Select pressed p1.25*/
		/* Joytick Down pressed p1.26 --> using J_DOWN due to emulator issues*/
		
		J_left++;
		switch(J_left){
			case 0x0A:
		      VAR--;
			    LED_Out(VAR);
				break;
			default:
				break;
		}
	}
	else{
			J_left=0;
	}
	
	
	if((LPC_GPIO1->FIOPIN & (1<<25)) == 0){	
		/* Joytick Select pressed p1.25*/
		/* Joytick Down pressed p1.26 --> using J_DOWN due to emulator issues*/
		J_select++;
		switch(J_select){
			case 1:
				if(asm_done==0){
					 LED_Out(0x00);
			     VAR=0;
				}
				else{					
					for(i=0;i<N;i++){
						VETT[i]=0;
					}
					VAR=0;
					asm_done=0;
				}
				break;
			default:
				break;
		}
	}
	else{
			J_select=0;
	}
	
	
	if(down_0!=0){  
			down_0 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){

			switch(down_0){
			case 2:
				if(posizione==N || (VETT[posizione-2]==VETT[posizione-1] && posizione>=2)){
					result = sopra_la_media(VETT, posizione); 
					asm_done=1;
					if(result<255){
						LED_Out(result);
					}
					enable_timer(0);
				}
				else{
			    VETT[posizione]=VAR;
				  posizione++;
				  VAR=0;
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

	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
