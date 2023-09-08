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
#include "string.h"

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
volatile int down_0;
volatile int down_1;
volatile int down_2;
extern int translate_morse(char* vett_input, int vet_input_lenght, char* vett_output, int vet_output_lenght, char change_symbol, char space, char sentence_end);

void RIT_IRQHandler (void)
{			
	int i=0;
	int n=0;
	char input[100] = "00002111201002013112001210210021113011112001114";
	int length = strlen(input);
	const int dim = 100;
  char output[dim];
	volatile int RES;
	
	if(down_0!=0){  
			down_0 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){
      
			switch(down_0){
			case 2:
				LPC_GPIO2->FIOCLR    = 0x000000FF;  //all LEDs off
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
				for(i=0;i<length-1;i++){
					if((input[i+1]=='2'|| input[i+1]=='3' || input[i+1]=='4')){
						n++;
			      LED_Out(n);
		      }
		      if(input[i]=='3'){
			      n++;
			      LED_Out(n);
		      }
	      }
				
				LPC_GPIO2->FIOSET    = 0x000000FF;	//all LEDs on 
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
				
	      RES = translate_morse(input,length,output,dim,'2','3','4');
	      LED_Out(RES);
			
				break;
			default:			
				break;
		}
	}
	else {	/* button released */
		down_2=0;
		NVIC_EnableIRQ(EINT0_IRQn);							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 20);     /* External interrupt 0 pin selection */
		NVIC_EnableIRQ(EINT1_IRQn);							 /* enable Button interrupts			*/
		LPC_PINCON->PINSEL4    |= (1 << 22);     /* External interrupt 0 pin selection */
		NVIC_EnableIRQ(EINT2_IRQn);							 /* enable Button interrupts			*/
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
