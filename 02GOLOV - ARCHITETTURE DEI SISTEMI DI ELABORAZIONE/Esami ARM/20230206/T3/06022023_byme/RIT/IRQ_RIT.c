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

#define N 4

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

extern int differenza_media_positivi_negativi(int V[], unsigned int num, char *over);

volatile int downInt0=0;
volatile int downKey1=0;
volatile int downKey2=0;

int VETT[N]={0};
int pos=0;
int fill=0;
int diff;
int waitingInt0=0;
char over=0;

void RIT_IRQHandler (void)
{	
	static int down=0;
	int i;
	
	if((LPC_GPIO1->FIOPIN & (1<<26)) == 0){	
		/* Joytick DOWN pressed */
		down++;
		switch(down){
			case 1:
				if(waitingInt0 == 0) {
					disable_timer(2);
					VETT[pos++]=LPC_TIM2->TC;
					if(pos == N) {
						pos=0;
						fill++;
						if(fill >= 5) {
							enable_timer(1);
						} else {
							LED_Out(fill-1);
						}
					}
					enable_timer(2);
				}
				break;
			default:
				break;
		}
	}
	else {
			down=0;
	}
	
	/* button management */
	if(downInt0>1){ 
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){	/* INT0 pressed */
			switch(downInt0){				
				case 2:
					if(waitingInt0 == 0) {
						waitingInt0=1;
						diff=differenza_media_positivi_negativi(VETT, N, &over);
						if(over == 0) {
							if(diff >= 0)
								LED_Out(255);		// tutti LED accesi
							else
								LED_On(7);			// LED 4 acceso
						} else {
							enable_timer(0);
						}
					} else if(waitingInt0 == 1) {
						waitingInt0=0;
						LED_Out(0);			// LED spenti
						pos=0;
						fill=0;
						for(i=0; i<N; i++)
							VETT[i]=0;
					}
					break;
				default:
					break;
			}
			downInt0++;
		}
		else {	/* button released */
			downInt0=0;			
			NVIC_EnableIRQ(EINT0_IRQn);							 /* enable Button interrupts			*/
			LPC_PINCON->PINSEL4    |= (1 << 20);     /* External interrupt 0 pin selection */
		}
	}
	else{
			if(downInt0==1)
				downInt0++;
	}
	
	if(downKey1>1){ 
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){	/* KEY1 pressed */
			switch(downKey1){				
				case 2:				/* pay attention here: please see slides 19_ to understand value 2 */
					break;
				default:
					break;
			}
			downKey1++;
		}
		else {	/* button released */
			downKey1=0;			
			NVIC_EnableIRQ(EINT1_IRQn);							 /* enable Button interrupts			*/
			LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
		}
	}
	else{
			if(downKey1==1)
				downKey1++;
	}
	
	if(downKey2>1){ 
		if((LPC_GPIO2->FIOPIN & (1<<12)) == 0){	/* KEY2 pressed */
			switch(downKey2){				
				case 2:				/* pay attention here: please see slides 19_ to understand value 2 */
					break;
				default:
					break;
			}
			downKey2++;
		}
		else {	/* button released */
			downKey2=0;			
			NVIC_EnableIRQ(EINT2_IRQn);							 /* enable Button interrupts			*/
			LPC_PINCON->PINSEL4    |= (1 << 24);     /* External interrupt 0 pin selection */
		}
	}
	else{
			if(downKey2==1)
				downKey2++;
	}
	
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
