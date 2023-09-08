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
#include "../adc/adc.h"
#include "../led/led.h"

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

extern uint8_t int0;
extern uint8_t key1;
extern uint8_t key2;

void handleJoystick() {
	static int select = 0;
	static int down 	= 0;
	static int left 	= 0;
	static int right = 0;
	static int up = 0;
	
	if((LPC_GPIO1->FIOPIN & (1<<25)) == 0){	
		/* Joytick Select pressed */
		select++;
		if(select == 1){
			// serve Select
				LED_Out(8);
		}
	} else select = 0;

	if((LPC_GPIO1->FIOPIN & (1<<26)) == 0){	
		/* Joytick down pressed */
		down++;
		if(down == 1){
			// serve Down
				LED_Out(16);
		}
	} else down = 0;
	
	if((LPC_GPIO1->FIOPIN & (1<<27)) == 0){	
		/* Joytick left pressed */
		left++;
		if(left == 1){
			// serve Left
				LED_Out(32);
		}
	} else left = 0;
	
	if((LPC_GPIO1->FIOPIN & (1<<28)) == 0){	
		/* Joytick down pressed */
		right++;
		if(right == 1){
			// serve Right
				LED_Out(64);
		}
	} else right = 0;

	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	
		/* Joytick up pressed */
		up++;
		if(up == 1){
			// serve Up
				LED_Out(128);
		}
	} else up = 0;
}

void handleButtons() {
	if(int0 > 1){
		if((LPC_GPIO2->FIOPIN & (1 << 10)) == 0){ // INT0 is pressed
			switch(int0){
				case 2:
				// serve Int0
				LED_Out(1);
				break;
				default: break;
			}
			int0++;
		} else {
			int0 = 0;
			NVIC_EnableIRQ(EINT0_IRQn);
			LPC_PINCON->PINSEL4 |= (1 << 20);
		}
	} else if(int0 == 1) int0++;
	if(key1 > 1){
		if((LPC_GPIO2->FIOPIN & (1 << 11)) == 0){ // KEY1 is pressed
			switch(key1){
				case 2:
				// serve Key1
				LED_Out(2);
				break;
				default: break;
			}
			key1++;
		} else {
			key1 = 0;
			NVIC_EnableIRQ(EINT1_IRQn);
			LPC_PINCON->PINSEL4 |= (1 << 22);
		}
	} else if(key1 == 1) key1++;
	if(key2 > 1){
		if((LPC_GPIO2->FIOPIN & (1 << 12)) == 0){ // KEY2 is pressed
			switch(key2){
				case 2:
				// serve Key2
				LED_Out(4);
				break;
				default: break;
			}
			key2++;
		} else {
			key2 = 0;
			NVIC_EnableIRQ(EINT2_IRQn);
			LPC_PINCON->PINSEL4 |= (1 << 24);
		}
	} else if(key2 == 1) key2++;
}

void RIT_IRQHandler (void)
{			
	handleJoystick();
	handleButtons();
	ADC_start_conversion();
	
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
