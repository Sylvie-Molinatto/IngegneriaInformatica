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
#define N 100

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;

extern unsigned int totale_pressioni_con_filtro(unsigned char VETT[], unsigned int numero_misure, unsigned char MAX, unsigned char MIN);

unsigned char VAR;

unsigned char MAX = 10;
unsigned char MIN = 5;

unsigned char VETT[N];
int posizione=0;
int led_accesi=0;
int result;
int result_num=0;
int valoreAcquisito=0;
	
void RIT_IRQHandler (void)
{		
	static int interval;
	static int i;
  // INT0
	if(down_0!=0){  
			down_0 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){
			switch(down_0){
				case 2:
					 result = totale_pressioni_con_filtro(VETT, posizione, MAX, MIN);
				   NVIC_DisableIRQ(EINT1_IRQn);							 
			     LPC_PINCON->PINSEL4    |= (1 << 22);
				   enable_timer(1);
           				    
				   LED_Out(result>>24);
				   result_num=1;
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_0=0;			
			NVIC_EnableIRQ(EINT0_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 20);     
		}
	}
	
	// KEY1
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){
			switch(down_1){
				case 2:
					   valoreAcquisito=0;
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			
			interval = down_1*0.5;
			if(interval<=255){
					VAR = interval; 
				  LED_Out(VAR);
			}
			else{
				VAR=255;
				enable_timer(0);
			}
		  
			valoreAcquisito=1;
			down_1=0;			
			NVIC_EnableIRQ(EINT1_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 22);     
		}
	}
	
	// KEY2
	if(down_2!=0){  
			down_2 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<12)) == 0){
			switch(down_2){
				case 2:
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			
			if(valoreAcquisito==1 && down_2<20){
				 VETT[posizione]=VAR;
				 posizione++;
				
				 if(posizione==255){
					result = totale_pressioni_con_filtro(VETT, posizione, MAX, MIN);
					NVIC_DisableIRQ(EINT1_IRQn);							 
			    LPC_PINCON->PINSEL4    |= (1 << 22);
					enable_timer(1);
				  LED_Out(result&0xf000);
					result_num=1;

				 }
				 
				 valoreAcquisito=0;
			}
			else{
				for(i=0;i<posizione;i++){
					VETT[posizione]=0;
				}
				posizione=0;
			}
			
			down_2=0;			
			NVIC_EnableIRQ(EINT2_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 24);     
		}
	}

	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
