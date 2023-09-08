/*----------------------------------------------------------------------------
 * Name:    sample.c
 * Purpose: to control led through debounced buttons and Joystick
 *        	- key1 switches on the led at the left of the current led on, 
 *					- it implements a circular led effect,
 * 					- joystick UP function returns to initial configuration (led11 on) .
 * Note(s): this version supports the LANDTIGER Emulator
 * Author: 	Paolo BERNARDI - PoliTO - last modified 15/12/2020
 *----------------------------------------------------------------------------
 *
 * This software is supplied "AS IS" without warranties of any kind.
 *
 * Copyright (c) 2017 Politecnico di Torino. All rights reserved.
 *----------------------------------------------------------------------------*/
                  
#include <stdio.h>
#include "LPC17xx.H"                    /* LPC17xx definitions                */
#include "led/led.h"
#include "button_EXINT/button.h"
#include "timer/timer.h"
#include "RIT/RIT.h"
#include "joystick/joystick.h"
#include "adc/adc.h"
#include "GLCD/GLCD.h" 

#ifdef SIMULATOR
extern uint8_t ScaleFlag; // <- ScaleFlag needs to visible in order for the emulator to find the symbol (can be placed also inside system_LPC17xx.h but since it is RO, it needs more work)
#endif
/*----------------------------------------------------------------------------
  Main Program
 *----------------------------------------------------------------------------*/

extern int C_ASM_func(int, int); // declared in startup_LPC17xx.s

int main (void) {
  	
	SystemInit();  												/* System Initialization (i.e., PLL) */
  LED_init();                           /* LED Initialization                */
  BUTTON_init();												/* BUTTON Initialization             */
	joystick_init();											/* Joystick Initialization           */
	ADC_init();                           /* ADC initialization 					  	 */
	init_timer(0, 0);											/* Timer N initialization						 */
	init_RIT(0x004C4B40);									/* RIT Initialization 50 msec        */ // rit freq = 100 MHz, 1 s = 100M tick
	enable_RIT();													/* RIT enabled											 */
	LCD_Initialization();
	LCD_Clear(Red);
	LPC_SC->PCON |= 0x1;									/* power-down	mode									 */
	LPC_SC->PCON &= ~(0x2);						
		
  while (1) {                           /* Loop forever                   	 */	
		__ASM("wfi");
  }

}
