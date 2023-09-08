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
#define N 3

extern unsigned char get_and_sort(unsigned char* VETT, unsigned char VAL, int n);

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_select = 0;
volatile int J_down = 0;
volatile int J_left = 0;
volatile int J_right = 0;
volatile int J_up = 0;

unsigned char VETT[N];
unsigned char VAL;
int posizione = 0;
int i = 0;

volatile uint32_t TC = 0;

void RIT_IRQHandler (void)
{	
	// KEY1
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){
			switch(down_1){
				case 2:
					disable_timer(1);
				  TC = LPC_TIM1->TC;
				  enable_timer(1);
   				VAL = (TC & 0x00FF0000)>>16;
					posizione++;
				  get_and_sort(VETT, VAL, posizione);
				  if(posizione<N){
				     LED_Out(posizione);
					}
					else{
						LED_Out(VETT[i]);
						enable_timer(0);
						i++;
					}
				 
				  break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_1=0;			
			NVIC_EnableIRQ(EINT1_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 22);     
		}
	}

	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
